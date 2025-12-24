package com.silentsanta.wishlist_back.team;

import com.silentsanta.wishlist_back.matching.MatchingConfig;
import com.silentsanta.wishlist_back.matching.MatchingConfigRepository;
import com.silentsanta.wishlist_back.shared.ApiException;
import com.silentsanta.wishlist_back.user.UserEntity;
import com.silentsanta.wishlist_back.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final MatchingConfigRepository matchingConfigRepository;
    private final UserService userService;

    @Transactional
    public TeamEntity createTeam(String name) {
        UserEntity owner = userService.getAuthenticatedUser();

        if (!owner.isAdmin()) {
            throw new ApiException(403, "Nur Admins dürfen Teams erstellen.");
        }

        TeamEntity team = new TeamEntity();
        team.setName(name);
        team.setOwner(owner);
        team.setInviteCode(UUID.randomUUID().toString().substring(0, 4).toUpperCase());

        teamRepository.save(team); // 🟢 teamId existiert jetzt

        // Owner ist Mitglied
        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(owner);
        teamMemberRepository.save(member);

        // 🔥 MatchingConfig für dieses Team anlegen
        MatchingConfig cfg = new MatchingConfig();
        cfg.setTeamId(team.getId());
        cfg.setDirty(true);          // Teamänderung → Matching veraltet
        cfg.setExecuted(false);
        matchingConfigRepository.save(cfg);

        // falls kein activeTeam gesetzt → dieses Team aktiv machen
        if (owner.getActiveTeamId() == null) {
            owner.setActiveTeamId(team.getId());
            userService.save(owner);
        }

        return team;
    }


    @Transactional
    public TeamEntity joinTeam(String inviteCode) {
        UserEntity user = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new ApiException(404, "Ungültiger Einladungscode"));

        boolean alreadyMember = teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId());
        if (alreadyMember) {
            throw new ApiException(409, "Du bist bereits in diesem Team");
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(team);
        member.setUser(user);
        teamMemberRepository.save(member);

        // falls noch kein activeTeam → dieses Team aktiv machen
        if (user.getActiveTeamId() == null) {
            user.setActiveTeamId(team.getId());
            userService.save(user);
        }

        matchingConfigRepository.markDirtyByTeamId(team.getId());

        return team;
    }

    @Transactional
    public void leaveTeam(Long teamId) {
        UserEntity user = userService.getAuthenticatedUser();

        List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(user.getId())
                .stream()
                .filter(m -> m.getTeam().getId().equals(teamId))
                .toList();

        if (memberships.isEmpty()) {
            throw new ApiException(400, "Du bist in diesem Team nicht Mitglied");
        }

        TeamEntity team = memberships.get(0).getTeam();

        // Owner darf sein Team nicht einfach verlassen
        if (team.getOwner().getId().equals(user.getId())) {
            throw new ApiException(409, "Als Owner kannst du das Team nicht verlassen.");
        }

        memberships.forEach(teamMemberRepository::delete);

        // falls es das aktive Team war → activeTeamId zurücksetzen
        if (user.getActiveTeamId() != null && user.getActiveTeamId().equals(teamId)) {
            user.setActiveTeamId(null);
            userService.save(user);
        }
        matchingConfigRepository.markDirtyByTeamId(teamId);
    }

    @Transactional
    public void deleteTeam(Long teamId) {
        UserEntity owner = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ApiException(404, "Team nicht gefunden"));

        if (!team.getOwner().getId().equals(owner.getId())) {
            throw new ApiException(403, "Nur der Owner kann das Team löschen.");
        }

        // Alle Member entfernen
        List<TeamMemberEntity> members = teamMemberRepository.findByTeamId(teamId);
        members.forEach(teamMemberRepository::delete);

        teamRepository.delete(team);

        // falls es das aktive Team vom Owner war → zurücksetzen
        if (owner.getActiveTeamId() != null && owner.getActiveTeamId().equals(teamId)) {
            owner.setActiveTeamId(null);
            userService.save(owner);
        }
        matchingConfigRepository.markDirtyByTeamId(teamId);
    }

    @Transactional
    public void kickMember(Long teamId, Long userId) {
        UserEntity owner = userService.getAuthenticatedUser();

        TeamEntity team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ApiException(404, "Team nicht gefunden"));

        if (!team.getOwner().getId().equals(owner.getId())) {
            throw new ApiException(403, "Nur der Owner kann Mitglieder kicken.");
        }

        if (userId.equals(owner.getId())) {
            throw new ApiException(409, "Owner kann sich nicht selbst entfernen.");
        }

        List<TeamMemberEntity> memberships = teamMemberRepository.findByUserId(userId)
                .stream()
                .filter(m -> m.getTeam().getId().equals(teamId))
                .toList();

        if (memberships.isEmpty()) {
            throw new ApiException(404, "User ist nicht in diesem Team.");
        }

        memberships.forEach(teamMemberRepository::delete);

        matchingConfigRepository.markDirtyByTeamId(teamId);

    }

    @Transactional
    public void activateTeam(Long teamId) {
        UserEntity me = userService.getAuthenticatedUser();

        boolean isMember = teamMemberRepository.existsByTeamIdAndUserId(teamId, me.getId());
        if (!isMember) {
            throw new ApiException(403, "Du bist kein Mitglied dieses Teams.");
        }

        me.setActiveTeamId(teamId);
        userService.save(me);
    }
}
