using SPSSUploadTest.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using c = SPSSUploadTest.BL.Common.CommonLogic;

namespace SPSSUploadTest.BL.Home
{
    public class Home
    {
        SPSSTestEntities db = new SPSSTestEntities();
        public List<Models.Projects> FetchProjects(string projectName)
        {
            c c = new c();
            int Id = Convert.ToInt32(HttpContext.Current.Request.Cookies["UserId"].Value);
            var Projects = (from x in db.Projects
                            where (x.User == Id || x.AssignedUser == Id) && x.ProjectName.Contains(projectName)
                            select new Models.Projects
                            {
                                Id = x.Id,
                                ProjectId = x.ProjectId,
                                ProjectName = x.ProjectName,
                                StatusId = x.Status,
                                Status = x.Status == 1 ? "Active" : "Inactive",
                                ProjectType = x.ProjectType == 1 ? "FileUpload" : x.ProjectType == 2 ? "Manually" : "",
                                ProjectTypeId = x.ProjectType,
                                AssignedUserId = x.AssignedUser,
                                AssignedUser = (db.Users.Where(a => a.Id == x.AssignedUser).Select(a => a.Name).FirstOrDefault()),
                                UserId = x.User,
                                User = (db.Users.Where(a => a.Id == x.User).Select(a => a.Name).FirstOrDefault()),
                                Description = x.Description,
                                RecordCount = 0,
                                //CreatedDateS = "",
                                CreatedDate = x.CreatedDate,
                                //ModifiedDateS="",
                                ModifiedDate = x.ModifiedDate
                            }).OrderByDescending(x => x.Id).ToList();

            foreach (var item in Projects)
            {
                item.RecordCount = db.GetRecordsCount(item.Id).ToList()[0].Count ?? default(int);
                item.CreatedDateS = c.ConvertDatetimeToString(item.CreatedDate, "dd-MMM-yyyy");
                item.ModifiedDateS = c.ConvertDatetimeToString(item.ModifiedDate, "dd-MMM-yyyy");
            }
            return Projects;
        }
    }
}