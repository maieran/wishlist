package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserService userService;

    public TeamEntity createTeam(String name) {
        UserEntity owner = userService.getAuthenticatedUser();

        TeamEntity team = new TeamEntity();
        team.setName(name);
        team.setOwner(owner);
        team.setInviteCode(UUID.randomUUID().toString().substring(0, 8));

        teamRepository.save(team);

        // Owner ist automatisch Mitglied
        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(owner);
        teamMemberRepository.save(member);

        return team;
    }

    public TeamEntity joinTeam(String inviteCode) {
        UserEntity user = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            return team; // already member
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(user);

        teamMemberRepository.save(member);

        return team;
    }

    public List<TeamMemberEntity> listMembers(Long teamId) {
        return teamMemberRepository.findByTeamId(teamId);
    }
}
