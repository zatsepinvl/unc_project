package com.promeets.model.service.entity;

import com.promeets.model.entity.MeetNote;

import java.util.List;

/**
 * Created by Vladimir on 30.03.2016.
 */
public interface NoteService extends BaseService<MeetNote, Long> {
    List<MeetNote> getNotesByMeetId(long meetId);
    void deleteNotesByMeetId(long meetId);

}
