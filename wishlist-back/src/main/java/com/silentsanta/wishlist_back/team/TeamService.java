package com.silentsanta.wishlist_back.team;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.silentsanta.wishlist_back.shared.ApiException;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    // ───────────── Team erstellen ─────────────
    public TeamEntity createTeam(String name) {

        UserEntity user = userService.getAuthenticatedUser();

        // User hat schon ein Team → Fehler 409
        if (!teamMemberRepository.findByUserId(user.getId()).isEmpty()) {
            throw new ApiException(409, "User already in a team");
        }

        TeamEntity team = new TeamEntity();
        team.setName(name);
        team.setOwner(user);
        team.setInviteCode(UUID.randomUUID().toString().substring(0, 4).toUpperCase());

        teamRepository.save(team);

        // Owner ist automatisch Mitglied
        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(user);

        teamMemberRepository.save(member);

        return team;
    }

    // ───────────── Team beitreten ─────────────
    public TeamEntity joinTeam(String inviteCode) {
        UserEntity user = userService.getAuthenticatedUser();

        // User ist schon in Team
        if (!teamMemberRepository.findByUserId(user.getId()).isEmpty()) {
            throw new ApiException(409, "User already in a team");
        }

        TeamEntity team = teamRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new ApiException(404, "Ungültiger Einladungscode"));

       TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(user);

        teamMemberRepository.save(member);

        return team;
    }

    // ───────────── Team verlassen (NEU!) ─────────────
    public void leaveTeam() {
        UserEntity user = userService.getAuthenticatedUser();
        List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(user.getId());

        if (memberships.isEmpty()) {
            throw new ApiException(400, "Not in a team");
        }

        TeamEntity team = memberships.get(0).getTeam();

        // Owner darf nicht verlassen
        if (team.getOwner().getId().equals(user.getId())) {
            throw new ApiException(409, "Owner cannot leave team");
        }

        // Member entfernen
        memberships.forEach(teamMemberRepository::delete);
    }

    public void deleteTeam() {
    UserEntity user = userService.getAuthenticatedUser();

    // Prüfen, ob der User überhaupt in einem Team ist
    List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(user.getId());
        if (memberships.isEmpty()) {
            throw new ApiException(400, "Not in a team");
        }

        TeamEntity team = memberships.get(0).getTeam();

        // Owner Prüfung
        if (!team.getOwner().getId().equals(user.getId())) {
            throw new ApiException(403, "Only owner can delete the team");
        }

        // Alle Members löschen
        List<TeamMemberEntity> allMembers = teamMemberRepository.findByTeamId(team.getId());
        allMembers.forEach(teamMemberRepository::delete);

        // Team löschen
        teamRepository.delete(team);
    }

    public void kickMember(Long userId) {
        UserEntity owner = userService.getAuthenticatedUser();

        // Owner muss in einem Team sein
        List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(owner.getId());
        if (memberships.isEmpty()) {
            throw new ApiException(400, "Not in a team");
        }

        TeamEntity team = memberships.get(0).getTeam();

        // Prüfen: ist owner wirklich der owner?
        if (!team.getOwner().getId().equals(owner.getId())) {
            throw new ApiException(403, "Only owner can kick members");
        }

        // Prüfen: existiert dieser User in dem Team?
        List<TeamMemberEntity> targetMemberships = teamMemberRepository.findByUserId(userId);

        if (targetMemberships.isEmpty() ||
            !targetMemberships.get(0).getTeam().getId().equals(team.getId())) {
            throw new ApiException(404, "User not in your team");
        }

        UserEntity target = targetMemberships.get(0).getUser();

        // Owner kann sich selbst nicht kicken
        if (target.getId().equals(owner.getId())) {
            throw new ApiException(409, "Owner cannot kick themselves");
        }

        // kicken
        teamMemberRepository.delete(targetMemberships.get(0));
    }


}
