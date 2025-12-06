package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.team.dto.TeamResponse;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    public TeamService(TeamRepository teamRepository, TeamMemberRepository teamMemberRepository, UserService userService) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userService = userService;
    }

    // ADMIN erstellt Team
    public TeamEntity createTeam(String name) {
        UserEntity admin = userService.getAuthenticatedUser();

        if (!admin.isAdmin()) {
            throw new RuntimeException("Nur Admins dürfen Teams erstellen!");
        }

        TeamEntity t = new TeamEntity();
        t.setName(name);
        t.setOwner(admin);
        t.setInviteCode(UUID.randomUUID().toString().substring(0, 8));

        t = teamRepository.save(t);

        // Admin wird automatisch Mitglied
        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(t);
        member.setUser(admin);
        member.setAdmin(true);

        teamMemberRepository.save(member);

        return t;
    }

    public TeamEntity joinTeam(String inviteCode) {
        UserEntity user = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Ungültiger Einladungscode"));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            return team;
        }

        TeamMemberEntity m = new TeamMemberEntity();
        m.setTeam(team);
        m.setUser(user);
        m.setAdmin(false);
        teamMemberRepository.save(m);

        return team;
    }

    public void leaveTeam() {
        UserEntity me = userService.getAuthenticatedUser();

        TeamMemberEntity membership = teamMemberRepository.findOneByUserId(me.getId())
                .orElseThrow(() -> new RuntimeException("User ist in keinem Team"));

        teamMemberRepository.delete(membership);
    }

    public void deleteTeam(Long id) {
        UserEntity admin = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team nicht gefunden"));

        if (!team.getOwner().getId().equals(admin.getId())) {
            throw new RuntimeException("Nur Team-Owner darf Team löschen!");
        }

        teamMemberRepository.deleteByTeamId(team.getId());
        teamRepository.delete(team);
    }

    // Nutzer → sein Team
    public TeamEntity myTeam() {
        UserEntity me = userService.getAuthenticatedUser();

        return teamMemberRepository.findByUserId(me.getId())
                .stream()
                .findFirst()
                .map(TeamMemberEntity::getTeam)
                .orElse(null);
    }

    // komplette Antwort
    public TeamResponse buildTeamResponse(TeamEntity team) {

        List<TeamResponse.MemberDto> memberDtos =
                teamMemberRepository.findByTeamId(team.getId())
                        .stream()
                        .map(tm -> new TeamResponse.MemberDto(
                                tm.getUser().getId(),
                                tm.getUser().getUsername(),
                                tm.isAdmin()
                        ))
                        .toList();

        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getInviteCode(),
                memberDtos
        );
    }
}
