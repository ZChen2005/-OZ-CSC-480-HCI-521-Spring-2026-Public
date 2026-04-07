package worklog.application.classes;

import java.time.LocalDate;
import java.util.ArrayList;

public class Task {

    private String taskName; 

    private String goal;

    private String assignedUser; //Student or teacher object at some point? 
    
    private LocalDate dueDate;

    private LocalDate creationDate;
    private String status;

    private ArrayList<String> collaborators;

    private String reflection;

    public Task(){
        
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }



    public String getGoal() {
        return this.goal;
    }



    public void setGoal(String goal) {
        this.goal = goal;
    }



    public String getAssignedUser() {
        return this.assignedUser;
    }



    public void setAssignedUser(String assignedUser) {
        this.assignedUser = assignedUser;
    }



    public LocalDate getDueDate() {
        return this.dueDate;
    }



    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }



    public LocalDate getCreationDate() {
        return this.creationDate;
    }



    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }



    public ArrayList<String> getCollaborators() {
        return this.collaborators;
    }



    public void setCollaborators(ArrayList<String> collaborators) {
        this.collaborators = collaborators;
    }



    public String getStatus() {
        return this.status;
    }



    public void setStatus(String status) {
        this.status = status;
    }


    public String getReflection() {
        return this.reflection;
    }


    public void setReflection(String reflection) {
        this.reflection = reflection;
    }

    
    public String getTaskName() {
        return this.taskName;
    }


}
