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
        team.setInviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());

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
}
