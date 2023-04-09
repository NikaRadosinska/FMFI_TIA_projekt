package com.example.demo.model;

import java.awt.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Member {
    private int groupID;
    private int user;

    public Member(int groupID, int user){
        this.groupID = groupID;
        this.user = user;
    }

    private static List<Member> members = new ArrayList<>(Arrays.asList(
            new Member(0,0),
            new Member(1,1)
    ));

    public static List<Group> getUsersGroups(int userId){
        return members.stream().filter(member -> member.user == userId).map(member -> Group.getById(member.groupID)).toList();
    }

    public static boolean addUserToGroup(int userid, int groupid){
        if (members.stream().anyMatch(m -> m.user == userid && m.groupID == groupid)) return false;
        members.add(new Member(groupid, userid));
        return true;
    }

    public static boolean leaveGroup(int userid, int groupid){
        boolean ret = members.removeIf(m -> m.groupID == groupid && m.user == userid);
        if(members.stream().noneMatch(m -> m.groupID == groupid)) Group.deleteGroup(groupid);
        return ret;
    }
}
