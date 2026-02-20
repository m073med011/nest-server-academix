/**
 * MongoDB Collection Rename Migration Script
 * 
 * This script handles the case where both old and new collections exist.
 * It will:
 * 1. Copy data from old collection to new collection (if new is empty)
 * 2. Drop the old collection after successful migration
 * 
 * Run this script using MongoDB shell:
 *   mongosh "your-connection-string" rename-collections.js
 * 
 * Or in MongoDB Compass, open the mongosh tab and paste the content.
 */

const renames = [
  { from: 'otps', to: 'otp_codes' },
  { from: 'materials', to: 'course_materials' },
  { from: 'organizationmemberships', to: 'organization_memberships' },
  { from: 'terms', to: 'academic_terms' },
  { from: 'organizationroles', to: 'organization_roles' },
  { from: 'levels', to: 'academic_levels' },
  { from: 'discountcodes', to: 'discount_codes' },
  { from: 'attendances', to: 'attendance_records' },
];

console.log('Starting collection rename migration...\n');

for (const { from, to } of renames) {
  try {
    const collections = db.getCollectionNames();
    const oldExists = collections.includes(from);
    const newExists = collections.includes(to);

    if (!oldExists && !newExists) {
      console.log(`⏭️  Skipped: ${from} (neither old nor new exists)`);
      continue;
    }

    if (!oldExists && newExists) {
      console.log(`✅ Already done: ${to} (new collection exists, old is gone)`);
      continue;
    }

    if (oldExists && !newExists) {
      // Simple rename
      db[from].renameCollection(to);
      console.log(`✅ Renamed: ${from} → ${to}`);
      continue;
    }

    // Both exist - need to migrate data
    if (oldExists && newExists) {
      const oldCount = db[from].countDocuments();
      const newCount = db[to].countDocuments();

      if (oldCount === 0) {
        // Old is empty, just drop it
        db[from].drop();
        console.log(`✅ Dropped empty old: ${from} (new ${to} has ${newCount} docs)`);
        continue;
      }

      if (newCount === 0) {
        // New is empty, copy from old then drop old
        const docs = db[from].find().toArray();
        if (docs.length > 0) {
          db[to].insertMany(docs);
        }
        db[from].drop();
        console.log(`✅ Migrated: ${from} (${oldCount} docs) → ${to}, dropped old`);
        continue;
      }

      // Both have data - manual review needed
      console.log(`⚠️  CONFLICT: Both ${from} (${oldCount} docs) and ${to} (${newCount} docs) have data!`);
      console.log(`   → Please manually review and merge, then drop: db.${from}.drop()`);
    }
  } catch (err) {
    console.log(`❌ Failed: ${from} → ${to} | Error: ${err.message}`);
  }
}

console.log('\n✨ Migration complete!');
console.log('\nVerify with: db.getCollectionNames()');
