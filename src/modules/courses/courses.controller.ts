import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CourseFilterDto,
  AddEditorDto,
} from './dto/courses.dto';
import { Response } from 'express';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created.' })
  async create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
    return this.coursesService.create(createCourseDto, req.user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Courses retrieved.' })
  async findAll(@Query() filterDto: CourseFilterDto) {
    return this.coursesService.findAll(filterDto);
  }

  @Get('user/purchased')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user purchased courses' })
  @ApiResponse({ status: 200, description: 'Purchased courses retrieved.' })
  async getUserPurchasedCourses(@Request() req) {
    return this.coursesService.getUserPurchasedCourses(req.user._id);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  @ApiResponse({ status: 200, description: 'Instructor courses retrieved.' })
  async getByInstructor(@Param('instructorId') instructorId: string) {
    return this.coursesService.findByInstructor(instructorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved.' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course' })
  @ApiResponse({ status: 200, description: 'Course updated.' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course' })
  @ApiResponse({ status: 200, description: 'Course deleted.' })
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/enroll')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in course' })
  @ApiResponse({ status: 200, description: 'Enrolled successfully.' })
  async enroll(@Param('id') id: string, @Request() req) {
    return this.coursesService.enroll(id, req.user._id);
  }

  @Post(':id/editors')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add editor to course' })
  @ApiResponse({ status: 200, description: 'Editor added.' })
  async addEditor(@Param('id') id: string, @Body() addEditorDto: AddEditorDto) {
    return this.coursesService.addEditor(id, addEditorDto.editorId);
  }

  @Delete(':id/editors/:editorId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove editor from course' })
  @ApiResponse({ status: 200, description: 'Editor removed.' })
  async removeEditor(
    @Param('id') id: string,
    @Param('editorId') editorId: string,
  ) {
    return this.coursesService.removeEditor(id, editorId);
  }
}
