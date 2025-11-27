import time
import json
import random
from datetime import datetime, timedelta
from locust import HttpUser, between, task


class WebsiteUser(HttpUser):
    wait_time = between(5, 15)

    def on_start(self):
        self.token = None
        self.headers = {"Content-Type": "application/json"}
        self.ids = {
            "user_id": None,
            "org_id": None,
            "role_id": None,
            "level_id": None,
            "term_id": None,
            "course_id": None,
            "material_id": None,
            "chat_id": None,
            "recipient_id": None,
            "payment_id": None,
            "attendance_id": None,
        }
        self._seed_data()

    # ---------------------- Helpers ----------------------
    def _auth_headers(self):
        if self.token:
            return {**self.headers, "Authorization": f"Bearer {self.token}"}
        return self.headers

    def _rand_email(self, prefix: str = "user") -> str:
        return f"{prefix}_{int(time.time()*1000)}_{random.randint(1000, 9999)}@example.com"

    def _json(self, resp):
        try:
            return resp.json()
        except Exception:
            return {}

    def _seed_data(self):
        # Register OAuth-like user to obtain token immediately
        email = self._rand_email("locust")
        register_body = {
            "name": "Locust User",
            "email": email,
            "isOAuthUser": True,
            "provider": "GOOGLE",
            "role": "organizer",
            "imageProfileUrl": "https://example.com/avatar.png",
        }
        resp = self.client.post(
            "/v1/auth/register", data=json.dumps(register_body), headers=self.headers
        )
        data = self._json(resp)
        self.token = data.get("token") or data.get("data", {}).get("token")
        user = data.get("user") or data.get("data", {}).get("user") or {}
        self.ids["user_id"] = user.get("id") or user.get("_id")

        # Create second user to be used as chat recipient/member
        recipient_email = self._rand_email("locust_recipient")
        resp2 = self.client.post(
            "/v1/auth/register",
            data=json.dumps({
                "name": "Recipient User",
                "email": recipient_email,
                "isOAuthUser": True,
                "provider": "GOOGLE",
                "role": "student"
            }),
            headers=self.headers,
        )
        user2 = self._json(resp2).get("user") or {}
        self.ids["recipient_id"] = user2.get("id") or user2.get("_id")

        # Create organization
        org_body = {
            "name": f"Org {int(time.time())}", "description": "Load test org"}
        org_resp = self.client.post(
            "/v1/organizations", data=json.dumps(org_body), headers=self._auth_headers())
        org_data = self._json(org_resp).get("data") or {}
        self.ids["org_id"] = org_data.get("_id") or org_data.get("id")

        # Create role within organization
        if self.ids["org_id"]:
            role_body = {
                "name": "Manager",
                "permissions": {
                    "canManageOrganization": True,
                    "canManageLevels": True,
                    "canManageTerms": True,
                    "canManageCourses": True,
                    "canManageStudents": True,
                    "canManageRoles": True,
                    "canRecordAttendance": True,
                    "canViewReports": True,
                },
            }
            role_resp = self.client.post(
                f"/v1/organizations/{self.ids['org_id']}/roles",
                data=json.dumps(role_body),
                headers=self._auth_headers(),
            )
            role_data = self._json(role_resp).get("data") or {}
            self.ids["role_id"] = role_data.get("_id") or role_data.get("id")

        # Add recipient user as a member (if possible)
        if self.ids["org_id"] and self.ids["recipient_id"] and self.ids["role_id"]:
            self.client.post(
                f"/v1/organizations/{self.ids['org_id']}/members",
                data=json.dumps({
                    "userId": self.ids["recipient_id"],
                    "roleId": self.ids["role_id"],
                }),
                headers=self._auth_headers(),
            )

        # Create level
        if self.ids["org_id"]:
            lvl_resp = self.client.post(
                f"/v1/levels/organizations/{self.ids['org_id']}/levels",
                data=json.dumps(
                    {"name": "Level 1", "description": "Beginners"}),
                headers=self._auth_headers(),
            )
            lvl_data = self._json(lvl_resp).get("data") or self._json(lvl_resp)
            self.ids["level_id"] = lvl_data.get("_id") or lvl_data.get("id")

        # Create term
        if self.ids["level_id"] and self.ids["org_id"]:
            start = datetime.utcnow()
            end = start + timedelta(days=90)
            term_resp = self.client.post(
                f"/v1/terms/levels/{self.ids['level_id']}/terms",
                data=json.dumps({
                    "name": "Term 1",
                    "description": "Q1",
                    "organizationId": self.ids["org_id"],
                    "startDate": start.isoformat() + "Z",
                    "endDate": end.isoformat() + "Z",
                }),
                headers=self._auth_headers(),
            )
            term_data = self._json(term_resp).get(
                "data") or self._json(term_resp)
            self.ids["term_id"] = term_data.get("_id") or term_data.get("id")

        # Create organization course
        if self.ids["org_id"]:
            course_body = {
                "title": f"Course {random.randint(100, 999)}",
                "description": "Intro course",
                "price": 19.99,
                "duration": 10,
                "level": "beginner",
                "category": "general",
                "isPublished": True,
                "isOrgPrivate": True,
                "organizationId": self.ids["org_id"],
            }
            course_resp = self.client.post(
                f"/v1/organizations/{self.ids['org_id']}/courses",
                data=json.dumps(course_body),
                headers=self._auth_headers(),
            )
            course_data = self._json(course_resp).get("data") or {}
            self.ids["course_id"] = course_data.get(
                "_id") or course_data.get("id")

        # Assign course to term
        if self.ids["org_id"] and self.ids["course_id"] and self.ids["term_id"]:
            self.client.put(
                f"/v1/organizations/{self.ids['org_id']}/courses/{self.ids['course_id']}/assign-term",
                data=json.dumps({"termId": self.ids["term_id"]}),
                headers=self._auth_headers(),
            )

        # Create material (JSON body)
        if self.ids["course_id"]:
            mat_body = {
                "title": "Intro Video",
                "courseId": self.ids["course_id"],
                "type": "video",
                "content": {"videoUrl": "https://example.com/video.mp4", "duration": 600},
                "description": "Welcome"
            }
            mat_resp = self.client.post(
                "/v1/materials",
                data=json.dumps(mat_body),
                headers=self._auth_headers(),
            )
            mat_data = self._json(mat_resp).get("data") or {}
            self.ids["material_id"] = mat_data.get("_id") or mat_data.get("id")

        # Create private chat with recipient
        if self.ids["recipient_id"]:
            chat_resp = self.client.post(
                "/v1/chats/private",
                data=json.dumps({"recipientId": self.ids["recipient_id"]}),
                headers=self._auth_headers(),
            )
            chat_data = self._json(chat_resp).get("data") or {}
            self.ids["chat_id"] = chat_data.get("_id") or chat_data.get("id")

            # Send a message
            if self.ids["chat_id"]:
                self.client.post(
                    f"/v1/chats/{self.ids['chat_id']}/messages",
                    data=json.dumps({"content": "Hello from Locust!"}),
                    headers=self._auth_headers(),
                )

        # Create payment
        if self.ids["course_id"]:
            pay_resp = self.client.post(
                "/v1/payments/create",
                data=json.dumps({
                    "courseId": self.ids["course_id"],
                    "paymentMethod": "card",
                    "billingData": {
                        "firstName": "John",
                        "lastName": "Doe",
                        "email": email,
                        "phoneNumber": "1234567890",
                    },
                }),
                headers=self._auth_headers(),
            )
            pay_data = self._json(pay_resp).get("data") or {}
            self.ids["payment_id"] = pay_data.get(
                "_id") or pay_data.get("id") or pay_data.get("paymentId")

        # Record attendance
        if all([self.ids.get("user_id"), self.ids.get("course_id"), self.ids.get("material_id"), self.ids.get("org_id")]):
            att_resp = self.client.post(
                "/v1/attendance",
                data=json.dumps({
                    "userId": self.ids["user_id"],
                    "courseId": self.ids["course_id"],
                    "materialId": self.ids["material_id"],
                    "organizationId": self.ids["org_id"],
                    "status": "present",
                    "notes": "Checked in"
                }),
                headers=self._auth_headers(),
            )
            att_data = self._json(att_resp).get("data") or self._json(att_resp)
            self.ids["attendance_id"] = att_data.get(
                "_id") or att_data.get("id")

    # ---------------------- Basic health/root ----------------------
    @task
    def health(self):
        self.client.get("/health")

    @task
    def api_root(self):
        self.client.get("/")

    # ---------------------- Auth APIs ----------------------
    @task
    def auth_me(self):
        self.client.get("/v1/auth/me", headers=self._auth_headers())

    @task
    def auth_login_credentials(self):
        # Use a temporary credentials user to exercise the endpoint
        email = self._rand_email("creds")
        password = "Pa55word1!"
        self.client.post("/v1/auth/register", data=json.dumps({
            "name": "Creds User",
            "email": email,
            "password": password,
            "role": "student"
        }), headers=self.headers)
        self.client.post("/v1/auth/login", data=json.dumps({
            "email": email,
            "password": password
        }), headers=self.headers)

    @task
    def auth_refresh(self):
        # Attempt refresh using empty token to hit validation path
        self.client.post("/v1/auth/refresh", data=json.dumps(
            {"refreshToken": "invalid-or-empty"}), headers=self.headers)

    @task
    def auth_user_by_email(self):
        if self.ids.get("user_id"):
            # We need email; call /v1/auth/me first to obtain email
            me = self.client.get("/v1/auth/me", headers=self._auth_headers())
            email = (self._json(me).get("user") or {}).get("email")
            if email:
                self.client.get(f"/v1/auth/user/{email}")

    @task
    def auth_2fa_enable_disable(self):
        self.client.post("/v1/auth/enable-2fa", headers=self._auth_headers())
        self.client.post("/v1/auth/confirm-2fa",
                         data=json.dumps({"otp": "000000"}), headers=self._auth_headers())
        self.client.post("/v1/auth/disable-2fa", headers=self._auth_headers())

    # ---------------------- OTP APIs ----------------------
    @task
    def otp_generate_verify_resend(self):
        email = self._rand_email("otp")
        self.client.post("/v1/otp/generate", data=json.dumps(
            {"email": email, "purpose": "email_verification"}), headers=self.headers)
        self.client.post("/v1/otp/verify", data=json.dumps(
            {"email": email, "code": "123456", "purpose": "email_verification"}), headers=self.headers)
        self.client.post("/v1/otp/resend", data=json.dumps(
            {"email": email, "purpose": "email_verification"}), headers=self.headers)

    # ---------------------- User APIs ----------------------
    @task
    def user_profile(self):
        self.client.get("/v1/users/profile", headers=self._auth_headers())
        self.client.put("/v1/users/profile", data=json.dumps(
            {"name": "Locust Updated", "imageProfileUrl": "https://example.com/u.png"}), headers=self._auth_headers())

    @task
    def user_change_password(self):
        self.client.put("/v1/users/change-password", data=json.dumps({
            "currentPassword": "old",
            "newPassword": "NewPa55word1!",
            "confirmPassword": "NewPa55word1!"
        }), headers=self._auth_headers())

    @task
    def user_orgs_and_switch(self):
        self.client.get("/v1/users/organizations",
                        headers=self._auth_headers())
        if self.ids.get("org_id"):
            self.client.post("/v1/users/switch-context", data=json.dumps(
                {"organizationId": self.ids["org_id"]}), headers=self._auth_headers())

    @task
    def user_search(self):
        self.client.get("/v1/users/search?email=test@example.com",
                        headers=self._auth_headers())

    # ---------------------- Organization APIs ----------------------
    @task
    def organization_crud_and_members(self):
        if not self.ids.get("org_id"):
            return
        oid = self.ids["org_id"]
        # Get, update
        self.client.get(
            f"/v1/organizations/{oid}", headers=self._auth_headers())
        self.client.put(f"/v1/organizations/{oid}", data=json.dumps(
            {"description": "Updated by Locust"}), headers=self._auth_headers())
        # Members
        self.client.get(
            f"/v1/organizations/{oid}/members", headers=self._auth_headers())
        if self.ids.get("recipient_id") and self.ids.get("role_id"):
            self.client.post(f"/v1/organizations/{oid}/members", data=json.dumps({
                "userId": self.ids["recipient_id"],
                "roleId": self.ids["role_id"]
            }), headers=self._auth_headers())
            self.client.delete(
                f"/v1/organizations/{oid}/members/{self.ids['recipient_id']}", headers=self._auth_headers())
        self.client.post(
            f"/v1/organizations/{oid}/members/leave", headers=self._auth_headers())

    @task
    def organization_roles(self):
        if not self.ids.get("org_id"):
            return
        oid = self.ids["org_id"]
        self.client.get(
            f"/v1/organizations/{oid}/roles", headers=self._auth_headers())
        # Create temp role then update and delete it to avoid breaking setup role
        create = self.client.post(f"/v1/organizations/{oid}/roles", data=json.dumps({
            "name": f"Role {random.randint(1, 999)}",
            "permissions": {
                "canManageOrganization": True,
                "canManageLevels": True,
                "canManageTerms": True,
                "canManageCourses": True,
                "canManageStudents": True,
                "canManageRoles": True,
                "canRecordAttendance": True,
                "canViewReports": True,
            }
        }), headers=self._auth_headers())
        r = self._json(create).get("data") or {}
        rid = r.get("_id") or r.get("id")
        if rid:
            self.client.put(f"/v1/organizations/{oid}/roles/{rid}", data=json.dumps(
                {"name": "Updated Role"}), headers=self._auth_headers())
            self.client.delete(
                f"/v1/organizations/{oid}/roles/{rid}", headers=self._auth_headers())

    @task
    def organization_invitation_and_users(self):
        if not (self.ids.get("org_id") and self.ids.get("recipient_id")):
            return
        oid = self.ids["org_id"]
        self.client.post(
            f"/v1/organizations/{oid}/invitations/accept", headers=self._auth_headers())
        self.client.get(
            f"/v1/organizations/{oid}/users", headers=self._auth_headers())
        self.client.get(
            f"/v1/organizations/{oid}/users/{self.ids['recipient_id']}", headers=self._auth_headers())
        if self.ids.get("role_id"):
            self.client.put(f"/v1/organizations/{oid}/users/{self.ids['recipient_id']}/role", data=json.dumps({
                "roleId": self.ids["role_id"]
            }), headers=self._auth_headers())

    @task
    def organization_courses(self):
        if not self.ids.get("org_id"):
            return
        oid = self.ids["org_id"]
        self.client.get(
            f"/v1/organizations/{oid}/courses", headers=self._auth_headers())
        # Create temp course then update and delete
        course_body = {
            "title": f"Temp Course {random.randint(100, 999)}",
            "description": "Temp",
            "price": 9.99,
            "duration": 5,
            "level": "beginner",
            "category": "general",
            "isPublished": False,
            "isOrgPrivate": True,
            "organizationId": oid,
        }
        c = self.client.post(
            f"/v1/organizations/{oid}/courses", data=json.dumps(course_body), headers=self._auth_headers())
        cd = self._json(c).get("data") or {}
        cid = cd.get("_id") or cd.get("id")
        if cid:
            self.client.put(f"/v1/organizations/{oid}/courses/{cid}", data=json.dumps(
                {"title": "Temp Updated"}), headers=self._auth_headers())
            self.client.delete(
                f"/v1/organizations/{oid}/courses/{cid}", headers=self._auth_headers())

    # ---------------------- Course APIs ----------------------
    @task
    def courses_public_and_crud(self):
        self.client.get("/v1/courses")
        if self.ids.get("user_id"):
            self.client.get(
                f"/v1/courses/instructor/{self.ids['user_id']}", headers=self._auth_headers())
        if self.ids.get("course_id"):
            self.client.get(
                f"/v1/courses/{self.ids['course_id']}", headers=self._auth_headers())
        # Create standalone course then update/delete
        body = {
            "title": f"Standalone {random.randint(1, 999)}",
            "description": "Standalone course",
            "price": 14.99,
            "duration": 6,
            "level": "beginner",
            "category": "misc",
        }
        create = self.client.post(
            "/v1/courses", data=json.dumps(body), headers=self._auth_headers())
        created = self._json(create).get("data") or self._json(create)
        cid = created.get("_id") or created.get("id")
        if cid:
            self.client.put(
                f"/v1/courses/{cid}", data=json.dumps({"price": 15.99}), headers=self._auth_headers())
            self.client.post(
                f"/v1/courses/{cid}/enroll", headers=self._auth_headers())
            if self.ids.get("recipient_id"):
                self.client.post(f"/v1/courses/{cid}/editors", data=json.dumps(
                    {"editorId": self.ids["recipient_id"]}), headers=self._auth_headers())
                self.client.delete(
                    f"/v1/courses/{cid}/editors/{self.ids['recipient_id']}", headers=self._auth_headers())
            self.client.delete(
                f"/v1/courses/{cid}", headers=self._auth_headers())

    # ---------------------- Material APIs ----------------------
    @task
    def materials_endpoints(self):
        if self.ids.get("course_id"):
            self.client.get(
                f"/v1/materials/course/{self.ids['course_id']}", headers=self._auth_headers())
        if self.ids.get("material_id"):
            self.client.get(
                f"/v1/materials/{self.ids['material_id']}", headers=self._auth_headers())
            self.client.put(f"/v1/materials/{self.ids['material_id']}", data=json.dumps(
                {"title": "Intro Updated"}), headers=self._auth_headers())
        # Reorder stub
        if self.ids.get("course_id") and self.ids.get("material_id"):
            self.client.post("/v1/materials/reorder", data=json.dumps({
                "courseId": self.ids["course_id"],
                "materialId": self.ids["material_id"],
                "newOrder": 1
            }), headers=self._auth_headers())

    # ---------------------- Chat APIs ----------------------
    @task
    def chats_endpoints(self):
        self.client.get("/v1/chats/my-chats", headers=self._auth_headers())
        if self.ids.get("chat_id"):
            self.client.get(
                f"/v1/chats/{self.ids['chat_id']}", headers=self._auth_headers())
            self.client.get(
                f"/v1/chats/{self.ids['chat_id']}/messages", headers=self._auth_headers())
            self.client.post(f"/v1/chats/{self.ids['chat_id']}/read", data=json.dumps(
                {"messageIds": []}), headers=self._auth_headers())
            self.client.get(
                f"/v1/chats/{self.ids['chat_id']}/unread", headers=self._auth_headers())

    # ---------------------- Payment APIs ----------------------
    @task
    def payments_endpoints(self):
        if self.ids.get("payment_id"):
            self.client.get(
                f"/v1/payments/callback/{self.ids['payment_id']}/status")
            self.client.put(f"/v1/payments/{self.ids['payment_id']}/status", data=json.dumps(
                {"status": "success"}), headers=self._auth_headers())
        self.client.get("/v1/payments/history", headers=self._auth_headers())
        # Webhook (public) with dummy signature/payload
        self.client.post("/v1/payments/webhook", data=json.dumps({"event": "payment.paid"}), headers={
                         "Content-Type": "application/json", "x-paymob-signature": "dummy"})

    # ---------------------- Analysis APIs ----------------------
    @task
    def analysis_endpoints(self):
        if self.ids.get("user_id"):
            self.client.get(
                f"/v1/analysis/instructor/{self.ids['user_id']}/analysis/count", headers=self._auth_headers())

    # ---------------------- Level APIs ----------------------
    @task
    def levels_endpoints(self):
        if not (self.ids.get("org_id") and self.ids.get("level_id")):
            return
        oid = self.ids["org_id"]
        lid = self.ids["level_id"]
        self.client.get(
            f"/v1/levels/organizations/{oid}/levels", headers=self._auth_headers())
        self.client.get(f"/v1/levels/{lid}", headers=self._auth_headers())
        self.client.put(f"/v1/levels/{lid}", data=json.dumps(
            {"description": "Updated level"}), headers=self._auth_headers())
        self.client.get(f"/v1/levels/{lid}/students",
                        headers=self._auth_headers())
        # Create + delete a temp level to exercise delete
        temp = self.client.post(f"/v1/levels/organizations/{oid}/levels", data=json.dumps(
            {"name": "Temp Level"}), headers=self._auth_headers())
        tdata = self._json(temp).get("data") or self._json(temp)
        tid = tdata.get("_id") or tdata.get("id")
        if tid:
            self.client.delete(
                f"/v1/levels/{tid}", headers=self._auth_headers())

    # ---------------------- Term APIs ----------------------
    @task
    def terms_endpoints(self):
        if not (self.ids.get("level_id") and self.ids.get("org_id") and self.ids.get("term_id")):
            return
        lid = self.ids["level_id"]
        tid = self.ids["term_id"]
        self.client.get(
            f"/v1/terms/levels/{lid}/terms", headers=self._auth_headers())
        self.client.get(f"/v1/terms/{tid}", headers=self._auth_headers())
        self.client.put(f"/v1/terms/{tid}", data=json.dumps(
            {"description": "Updated term"}), headers=self._auth_headers())
        # Create + delete temp term
        start = datetime.utcnow()
        end = start + timedelta(days=30)
        temp = self.client.post(f"/v1/terms/levels/{lid}/terms", data=json.dumps({
            "name": "Temp Term",
            "organizationId": self.ids["org_id"],
            "startDate": start.isoformat() + "Z",
            "endDate": end.isoformat() + "Z",
        }), headers=self._auth_headers())
        t = self._json(temp).get("data") or self._json(temp)
        nid = t.get("_id") or t.get("id")
        if nid:
            self.client.delete(
                f"/v1/terms/{nid}", headers=self._auth_headers())

    # ---------------------- Attendance APIs ----------------------
    @task
    def attendance_endpoints(self):
        if self.ids.get("attendance_id"):
            self.client.put(f"/v1/attendance/{self.ids['attendance_id']}", data=json.dumps(
                {"status": "absent"}), headers=self._auth_headers())
        if self.ids.get("material_id"):
            self.client.get(
                f"/v1/attendance/material/{self.ids['material_id']}", headers=self._auth_headers())
        if self.ids.get("course_id"):
            self.client.get(
                f"/v1/attendance/course/{self.ids['course_id']}/report", headers=self._auth_headers())
        if self.ids.get("user_id"):
            self.client.get(
                f"/v1/attendance/student/{self.ids['user_id']}", headers=self._auth_headers())
