import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  findAll(@CurrentUser() user: { userId: string }, @Query('search') search?: string) {
    return this.notesService.findAll(user.userId, search);
  }

  @Get(':id')
  findOne(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.notesService.findOne(user.userId, id);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() body: { title: string; content: string; questionId?: string },
  ) {
    return this.notesService.create(user.userId, body.title, body.content, body.questionId);
  }

  @Put(':id')
  update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string },
  ) {
    return this.notesService.update(user.userId, id, body.title, body.content);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.notesService.delete(user.userId, id);
  }
}
