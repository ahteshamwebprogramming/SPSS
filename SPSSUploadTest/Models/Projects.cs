using System;

namespace SPSSUploadTest.Models
{
    public class Projects
    {
        public int Id { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public Nullable<int> StatusId { get; set; }
        public string Status { get; set; }
        public Nullable<int> ProjectTypeId { get; set; }
        public string ProjectType { get; set; }
        public Nullable<int> AssignedUserId { get; set; }
        public string AssignedUser { get; set; }
        public Nullable<int> UserId { get; set; }
        public string User { get; set; }
        public string Description { get; set; }
        public Nullable<int> IsActive { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedDateS { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string ModifiedDateS { get; set; }
        public Nullable<int> CreatedById { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<int> ModifiedById { get; set; }
        public string ModifiedBy { get; set; }
        public string FileType { get; set; }
        public int RecordCount { get; set; }
    }
}