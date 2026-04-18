package auth.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

import auth.google.GoogleTokenVerifier;
import auth.user.AuthRepository;
import auth.user.RefreshRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.Document;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class AuthService {
        @Inject
        private AuthRepository repo;

        @Inject
        private RefreshRepository refreshRepo;

        @Inject
        private GoogleTokenVerifier googleTokenVerifier;
        public Document verifyAndGetUser(String token, String requestedRole) throws Exception {
            GoogleIdToken googleToken = googleTokenVerifier.verify(token);
            if(googleToken==null){
                throw new SecurityException("Invalid Google token");
            }
            GoogleIdToken.Payload payload = googleToken.getPayload();
            String name = (String) payload.get("name");
            String email = payload.getEmail();

            Document user = repo.findByEmail(email);
            if(user!=null){
      
                return user;
            }
            if(requestedRole==null || requestedRole.trim().isEmpty()){
                throw new IllegalArgumentException("ROLE IS REQUIRED");
            }
            String role = requestedRole.trim().toLowerCase();
            if(!role.equals("student") && !role.equals("instructor")){
                throw new IllegalArgumentException("Valid role is required");
            }
            if(email.equals("shusank8basyal@gmail.com") ||  email.equals("paul.austin@oswego.edu") || email.equals("vanessa.maike@oswego.edu")){
                role="instructor";
            }

            return repo.createUser(email, name, role, null, null);

            
        }

        public Document createRefreshToken(String userId, String email) {
            return refreshRepo.create(userId, email);
        }

        public Document validateRefreshToken(String token) {
            Document doc = refreshRepo.findByToken(token);
            if (doc == null) {
                throw new SecurityException("Invalid refresh token");
            }
            java.util.Date expiresAt = doc.getDate("expiresAt");
            if (expiresAt.before(java.util.Date.from(Instant.now()))) {
                refreshRepo.deleteByToken(token);
                throw new SecurityException("Refresh token expired");
            }
            return doc;
        }

        public void revokeRefreshToken(String token) {
            refreshRepo.deleteByToken(token);
        }

        public Document createInstuctor(String email, String name) {
            if (repo.findByEmail(email) != null) {
                return repo.updateUserRole(email, "instructor");
            }
            return repo.createUser(email, name, "instructor", null, null);
        }

        public Document getUserByEmail(String email) {
            Document user = repo.findByEmail(email);
            if (user == null) throw new SecurityException("User not found");
            return user;
        }

        public List<Document> getAllUsers(){
            return repo.getAllUsers();
        }

        public List<Document> getInstructors(){
            return repo.getUsersByRole("instructor");
        }

        public Document changeUserRole(String email, String newRole){
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            if(newRole==null || (!newRole.equals("student") && !newRole.equals("instructor"))){
                throw new IllegalArgumentException("Valid role is required");
            }
            repo.updateUserRole(email, newRole);
            return user;

        }

        public Document removeUser(String email) {
            return repo.removeUser(email);
        }

        public Document addUserTeam(String email, String team){
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            if(team==null){
                throw new IllegalArgumentException("Valid team is required");
            }

            List<String> teams = user.getList("team", String.class);
                
            if (teams.contains(team)) {
                throw new IllegalArgumentException("User already in team");
            }
             teams.add(team);
             repo.updateUserTeam(email, teams);
             return user;
        }

        public Document removeUserTeam(String email, String team){
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            if(team==null){
                throw new IllegalArgumentException("Valid team is required");
            }

            List<String> teams = user.getList("team", String.class);
                
            if (!teams.contains(team)) {
                throw new IllegalArgumentException("User not in team");
            }
            teams.remove(team);
            repo.updateUserTeam(email, teams);
            return user;
        }

        public Document updateUserPreferredName(String email, String preferredName){
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            if(preferredName==null || preferredName.trim().isEmpty()){
                throw new IllegalArgumentException("Valid preferred name is required");
            }
            repo.updateUserPreferredName(email, preferredName);
            return user;
        }

        public Document updateUserClassStanding(String email, String classStanding){
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            if(classStanding==null || classStanding.trim().isEmpty()){
                throw new IllegalArgumentException("Valid class standing is required");
            }
            repo.updateUserClassStanding(email, classStanding);
            return user;
         }

        public Document archiveUser(String email) {
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            repo.archiveUser(email);
            return user;
        }

        public Document unarchiveUser(String email) {
            Document user = repo.findByEmail(email);
            if(user==null){
                throw new IllegalArgumentException("User not found");
            }
            repo.unarchiveUser(email);
            return user;
        }

        public List<Document> getArchivedUsers(){
            return repo.getArchivedUsers();
        }
}
