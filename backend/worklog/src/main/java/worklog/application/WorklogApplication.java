package worklog.application;

import jakarta.annotation.security.DeclareRoles;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;
import org.eclipse.microprofile.auth.LoginConfig;

@ApplicationPath("/api")
@LoginConfig(authMethod = "MP-JWT", realmName = "MP-JWT")
@DeclareRoles({"student", "instructor"})
public class WorklogApplication extends Application {
    
}
