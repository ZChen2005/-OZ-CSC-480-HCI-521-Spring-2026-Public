package auth.user;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.bson.Document;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class AuthRepository{
    private MongoCollection<Document> collection;

    @Inject 
    public void setCollection(MongoDatabase db){
        this.collection = db.getCollection("users");
    }

    public Document findByEmail(String email){
        return collection.find(new Document("email", email)).first();
    }

    public Document createUser(String email, String name, String role, String preferredName, List<String> team){
        if(role==null || (!role.equals("student") && !role.equals("instructor"))){
            role = "student";
        }
        Document newUser = new Document()
            .append("email", email)
            .append("name", name)
            .append("role", role)
            .append("preferredName", preferredName)
            .append("team", team)
            .append("classStanding", "")
            .append("isArchived", false)
            .append("createdAt", Instant.now());
        collection.insertOne(newUser);
        return newUser;
    }
    public List<Document> getAllUsers(){
        return collection.find().into(new ArrayList<>());
    }

    public List<Document> getUsersByRole(String role){
        return collection.find(new Document("role", role)).into(new ArrayList<>());
    }

    public Document updateUserRole(String email, String newRole){
        Document user = findByEmail(email);
        if(user!=null){
            user.put("role", newRole);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
    }

    public Document removeUser(String email) {
        Document user = findByEmail(email);
        collection.deleteOne(new Document("email", email));
        return user;
    }

    public Document updateUserTeam(String email, List<String> teams){
        Document user = findByEmail(email);
        if(user!=null){
            user.put("team", teams);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
    }

     public Document updateUserPreferredName(String email, String preferredName){
        Document user = findByEmail(email);
        if(user!=null){
            user.put("preferredName", preferredName);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
     }

     public Document updateUserClassStanding(String email, String classStanding){
        Document user = findByEmail(email);
        if(user!=null){
            user.put("classStanding", classStanding);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
     }

     public Document archiveUser(String email) {
        Document user = findByEmail(email);
        if(user!=null){
            user.put("isArchived", true);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
     }

     public Document unarchiveUser(String email) {
        Document user = findByEmail(email);
        if(user!=null){
            user.put("isArchived", false);
            collection.replaceOne(new Document("email", email), user);
        }
        return user;
     }

     public List<Document> getArchivedUsers() {
        return collection.find(new Document("isArchived", true)).into(new ArrayList<>());
     }

}