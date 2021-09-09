using Newtonsoft.Json;
using SpssLib.DataReader;
using SPSSUploadTest.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using c = SPSSUploadTest.BL.Common.CommonLogic;

namespace SPSSUploadTest.Controllers
{
    [Authorize]
    public class ProjectController : Controller
    {

        SPSSTestEntities db = new SPSSTestEntities();
        // GET: Project
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult AddProject()
        {

            int Id = Convert.ToInt32(Request.Cookies["UserId"].Value);
            ViewBag.Users = db.Users.Where(x => x.Id != Id).ToList();

            return View();
        }

        public string CreateProject()
        {
            using (var dbContextTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    c com = new c();
                    var formdata = System.Web.HttpContext.Current.Request.Form;
                    string ProjectId = formdata["ProjectId"];
                    string ProjectName = formdata["ProjectName"];
                    int Status = com.ConvertToInt0(formdata["Status"]);
                    int ProjectType = com.ConvertToInt0(formdata["ProjectType"]);
                    int AssignUsers = com.ConvertToInt0(formdata["AssignUsers"]);

                    string Description = formdata["Description"];
                    int FileSaved = 0;
                    //if (Request.Files.Count > 0 && ProjectId.Trim() != "" && FileType.Trim() != "")
                    //{
                    //    HttpPostedFileBase file = Request.Files[0];
                    //    if (file.ContentLength > 0)
                    //    {
                    //        string _FileName = Path.GetFileName(file.FileName);
                    //        string ext = Path.GetExtension(file.FileName);
                    //        if (ext != FileType.Trim())
                    //        {
                    //            return "error_FileType selected and FileType uploaded do not match. Please Upload the correct file and try again";
                    //        }
                    //        string _path = Path.Combine(Server.MapPath("~/SPSSFiles"), ProjectId + ext);
                    //        file.SaveAs(_path);
                    //        FileSaved = 1;
                    //    }
                    //    else
                    //    {
                    //        FileSaved = 0;
                    //        return "error_Uploaded File has some error";

                    //    }
                    //}
                    if (db.Projects.Where(x => x.ProjectId == ProjectId).Count() > 0)
                    {
                        return "error_Project with this ProjectId (" + ProjectId + ") already exists";
                    }
                    Project project = new Project();
                    project.ProjectId = ProjectId;
                    project.ProjectName = ProjectName;
                    project.Status = Status;
                    project.ProjectType = ProjectType;
                    project.AssignedUser = AssignUsers;
                    project.Description = Description;
                    project.User = Convert.ToInt32(Request.Cookies["UserId"].Value);
                    project.IsActive = 1;
                    project.CreatedBy = Convert.ToInt32(Request.Cookies["UserId"].Value);
                    project.CreatedDate = DateTime.Now;
                    db.Projects.Add(project);
                    db.SaveChanges();
                    int id = project.Id;

                    dbContextTransaction.Commit();
                    return "success_Success";
                }
                catch (Exception ex)
                {
                    dbContextTransaction.Rollback();
                    return "error_" + ex.Message;
                }
            }
        }

        public ActionResult FileDetails()
        {
            return View();
        }
        public string UploadFile()
        {
            try
            {
                var formdata = System.Web.HttpContext.Current.Request.Form;
                string ProjectName = formdata["ProjectName"];
                string FileType = formdata["FileType"];
                if (Request.Files.Count > 0 && ProjectName.Trim() != "" && FileType.Trim() != "")
                {
                    HttpPostedFileBase file = Request.Files[0];
                    if (file.ContentLength > 0)
                    {
                        string _FileName = Path.GetFileName(file.FileName);
                        string ext = Path.GetExtension(file.FileName);
                        if (ext != FileType.Trim())
                        {
                            return "FileType selected and FileType uploaded do not match. Please Upload the correct file and try again";
                        }
                        ProjectName projectName = new ProjectName();
                        projectName.ProjectName1 = ProjectName;
                        projectName.Processed = 0;
                        db.ProjectNames.Add(projectName);
                        db.SaveChanges();
                        int id = projectName.Id;
                        string _path = Path.Combine(Server.MapPath("~/SPSSFiles"), id + ext);

                        file.SaveAs(_path);
                        return "Uploaded_Success";
                    }
                    else
                    {
                        return "Uploaded File has some error";
                    }
                }
                else
                {
                    return "Fill all the mandatory fields";
                }
            }
            catch (Exception ex)
            {
                return "Exception_Error";
            }
        }
        public ActionResult List()
        {
            ViewBag.ProjectList = db.ProjectNames.ToList();
            return View();
        }
        public bool ReadSPSSFile(int Id, string ProjectId)
        {
            try
            {
                db.deleteVariableValues(Id);

                BL.Common.CommonLogic commonLogic = new BL.Common.CommonLogic();
                //string filepath = @"C:\Users\mhdah\Desktop\Projects\SPSSTest\SPSSTest\StudyFiles\";
                string filepath = System.Web.Hosting.HostingEnvironment.MapPath("~/SPSSFiles/");
                using (FileStream fileStream = new FileStream(filepath + ProjectId + ".sav", FileMode.Open, FileAccess.Read, FileShare.Read, 2048 * 10, FileOptions.SequentialScan))
                {
                    // Create the reader, this will read the file header
                    SpssReader spssDataset = new SpssReader(fileStream);

                    // Iterate through all the varaibles
                    foreach (var variable in spssDataset.Variables)
                    {
                        // Display name and label
                        //Console.WriteLine("{0} - {1}", variable.Name, variable.Label);
                        c.WriteErrorLog(variable.Name + " - " + variable.Label + " - " + variable.Type);
                        ProjectVariable projectVariable = new ProjectVariable();
                        projectVariable.ProjectID = Id;
                        projectVariable.Variables = variable.Name;
                        projectVariable.Typs = (variable.Type.ToString().Trim().ToUpper() == "TEXT" ? "NVARCHAR(60)" : "INT");
                        projectVariable.UID = (variable.Type.ToString().Trim().ToUpper() == "TEXT" ? 0 : 1);
                        projectVariable.Labels = variable.Label;
                        projectVariable.Measure = variable.MeasurementType.ToString();
                        projectVariable.TblName = "Respondent_P" + Id;
                        db.ProjectVariables.Add(projectVariable);
                        // Display value-labels collection
                        foreach (KeyValuePair<double, string> label in variable.ValueLabels)
                        {
                            //Console.WriteLine(" {0} - {1}", label.Key, label.Value);
                            c.WriteErrorLog(label.Key + " - " + label.Value);
                            ProjectsValue projectsValue = new ProjectsValue();
                            projectsValue.ProjectID = Id;
                            projectsValue.Variables = variable.Name;
                            projectsValue.Value = label.Key.ToString();
                            projectsValue.Labels = label.Value;
                            projectsValue.CreateDate = DateTime.Now;
                            db.ProjectsValues.Add(projectsValue);
                        }
                        //db.SaveChanges();
                    }
                    db.SaveChanges();
                    //var rData = db.Database.SqlQuery<TutorAll>("execute dbo." + StoredProcedure.ManageUsers + " @opt=" + 1 + ",@Id=" + Id + "").ToList();
                    var res = db.DynamicTableStructure_New(Id);
                    // Iterate through all data rows in the file
                    foreach (var record in spssDataset.Records)
                    {
                        string queryStart = "INSERT INTO dbo.Respondent_P" + Id + "(";
                        string queryColumns = "";
                        string queryValues = "";
                        foreach (var variable in spssDataset.Variables)
                        {
                            Console.Write(variable.Name);
                            Console.Write(':');
                            // Use the corresponding variable object to get the values.
                            Console.Write(record.GetValue(variable));
                            // This will get the missing values as null, text with out extra spaces,
                            // and date values as DateTime.
                            // For original values, use record[variable] or record[int]

                            c.WriteErrorLog(variable.Name + " : " + record.GetValue(variable));

                            queryColumns += "[" + variable.Name + "],";
                            //string vValue = record.GetValue(variable) == null ? "null" : record.GetValue(variable).ToString().Trim();
                            string vValue = ""; // record.GetValue(variable) == null ? "null" : record.GetValue(variable).ToString().Trim();
                            if (variable.Type.ToString().Trim().ToUpper() == "TEXT")
                            {
                                vValue = record.GetValue(variable) == null ? "null," : "'" + record.GetValue(variable).ToString().Trim() + "',";
                            }
                            else
                            {
                                vValue = record.GetValue(variable) == null ? "null," : record.GetValue(variable).ToString().Trim() + ",";
                            }
                            //queryValues += (variable.Type.ToString().Trim().ToUpper() == "TEXT" ? ("'" + vValue + "',") : vValue + ",");
                            queryValues += vValue;
                            //Console.Write('\t');
                        }
                        //Console.WriteLine("");
                        queryColumns = queryColumns.TrimEnd(',');
                        queryValues = queryValues.TrimEnd(',');
                        string query = queryStart + queryColumns + ")VALUES(" + queryValues + ")";
                        db.INSERTDynamicTableValues(query);
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                //Response.Write("<script>alert('" + ex.Message + "')</script>");
                return false;
            }
        }
        public string ProcessFile(int ProjectId)
        {
            try
            {
                if (ReadSPSSFile(ProjectId, ""))
                //if (true)
                {
                    ProjectName p = new ProjectName();
                    p = db.ProjectNames.Where(x => x.Id == ProjectId).FirstOrDefault();
                    p.Processed = 1;
                    db.SaveChanges();
                    return "Successfully Processed";
                    //ViewBag.Variables = db.ProjectVariables.Where(x => x.ProjectID == ProjectId).ToList();
                    //ViewBag.Values = db.ProjectsValues.Where(x => x.ProjectID == ProjectId).ToList();
                    //var NewTable = db.fetchNewCreatedDynamicTable("Respondent_P" + Id);
                    //DataTable dt = db.Database.ExecuteSqlCommand("Exec [dbo].fetchNewCreatedDynamicTable @tblName ", new SqlParameter("@tblName", "Respondent_P" + Id));
                    //BusinessLogic.DataView abc = new BusinessLogic.DataView();
                    //DataSet ds = abc.FileData("Respondent_P" + ProjectId);
                    //DataTable dt = ds.Tables[0];
                    //ViewBag.filedata = dt;
                }
                else
                {
                    return "Some Error has occurred";
                }
            }
            catch (Exception ex)
            {
                return "Some exception has occurred";
            }
        }
        public ActionResult DataReport()
        {
            ViewBag.Projects = db.ProjectNames.Where(x => x.Processed == 1).ToList();
            return View();
        }
        public ActionResult FetchProjectData(int ProjectId, int ReportType)
        {
            if (ReportType == 1)
            {
                ViewBag.Data = db.ProjectsValues.Where(x => x.ProjectID == ProjectId).ToList();
                ViewBag.ProjectData = false;
                ViewBag.ProjectValues = true;
                ViewBag.ProjectVariables = false;
            }
            else if (ReportType == 2)
            {
                ViewBag.Data = db.ProjectVariables.Where(x => x.ProjectID == ProjectId).ToList();
                ViewBag.ProjectData = false;
                ViewBag.ProjectValues = false;
                ViewBag.ProjectVariables = true;
            }
            else
            {
                BusinessLogic.DataView abc = new BusinessLogic.DataView();
                DataSet ds = abc.FileData("Respondent_P" + ProjectId);
                DataTable dt = ds.Tables[0];
                ViewBag.filedata = dt;
                ViewBag.ProjectData = true;
                ViewBag.ProjectValues = false;
                ViewBag.ProjectVariables = false;
            }
            return PartialView("_dataProjectData");
        }

        public ActionResult GetProject(int Id)
        {
            int currentUser = Convert.ToInt32(Request.Cookies["UserId"].Value);
            ViewBag.Users = db.Users.Where(x => x.IsActive == 1 && x.Id != currentUser).ToList();
            var model = db.Projects.Where(x => x.Id == Id).FirstOrDefault();
            ViewBag.model = model;
            return PartialView("../Shared/_EditProject");
        }
        //[HttpPut]
        //[Route("projects")]
        public JsonResult UpdateProject(Project formData)
        {
            try
            {
                if (db.Projects.Where(x => x.ProjectId == formData.ProjectId && x.Id != formData.Id).Count() > 0)
                {
                    throw new Exception("Duplicate ProjectId");
                }
                var proj = db.Projects.Where(x => x.Id == formData.Id).ToList();
                if (proj.Count > 0)
                {
                    Project project = proj.FirstOrDefault();
                    project.ProjectId = formData.ProjectId;
                    project.ProjectName = formData.ProjectName;
                    project.Status = formData.Status;
                    project.ProjectType = formData.ProjectType;
                    project.AssignedUser = formData.AssignedUser;
                    project.Description = formData.Description;
                    project.ModifiedDate = System.DateTime.Now;
                    project.ModifiedBy = Convert.ToInt32(Request.Cookies["UserId"].Value);
                    db.SaveChanges();
                    return Json(new
                    {
                        status = HttpStatusCode.OK,
                        message = "success"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    throw new Exception("This project is not found");
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = HttpStatusCode.BadRequest,
                    message = ex.Message
                }, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UploadData()
        {
            BL.Common.CommonLogic cl = new BL.Common.CommonLogic();
            var formdata = System.Web.HttpContext.Current.Request.Form;
            int Id = cl.ConvertToInt0(formdata["Id"]);
            string FileType = Convert.ToString(formdata["FileType"]);
            if (Id > 0)
            {
                if (Request.Files.Count > 0 && FileType.Trim() != "")
                {
                    HttpPostedFileBase file = Request.Files[0];
                    if (file.ContentLength > 0)
                    {
                        string _FileName = Path.GetFileName(file.FileName);
                        string ext = Path.GetExtension(file.FileName);
                        if (ext != FileType.Trim())
                        {
                            return Json(new { status = HttpStatusCode.BadRequest, message = "Invalid File extension" }, JsonRequestBehavior.AllowGet);
                        }
                        string _path = Path.Combine(Server.MapPath("~/SPSSFiles"), Id + ext);

                        file.SaveAs(_path);
                        BL.Projects.Projects objproj = new BL.Projects.Projects();

                        if (objproj.ReadSPSSFile(Id))
                        //int z = 1;
                        //if (z == 1)
                        {
                            var ProjectVariables = db.ProjectVariables.Where(x => x.ProjectID == Id).ToList();
                            return Json(new { status = HttpStatusCode.OK, message = "Success", body = ProjectVariables }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            return Json(new { status = HttpStatusCode.BadRequest, message = "Unable to process the file" }, JsonRequestBehavior.AllowGet);
                        }
                    }
                    else
                    {
                        return Json(new { status = HttpStatusCode.BadRequest, message = "Invalid File Uploaded" }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    return Json(new { status = HttpStatusCode.BadRequest, message = "File not found or file type not selected" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new
                {
                    status = HttpStatusCode.NotFound,
                    message = "the project id is 0"
                }, JsonRequestBehavior.AllowGet);
            }
        }

        //public JsonResult GetProjectVariables()
        //{

        //}
        public JsonResult GetProjectValues()
        {
            BL.Common.CommonLogic cl = new BL.Common.CommonLogic();
            var formdata = System.Web.HttpContext.Current.Request.Form;
            int Id = cl.ConvertToInt0(formdata["Id"]);
            var data = db.ProjectsValues.Where(x => x.ProjectID == Id).ToList();
            return Json(new { status = HttpStatusCode.OK, message = "Data Found", body = data }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetRespondentData()
        {
            BL.Common.CommonLogic cl = new BL.Common.CommonLogic();
            var formdata = System.Web.HttpContext.Current.Request.Form;
            int Id = cl.ConvertToInt0(formdata["Id"]);

            BusinessLogic.DataView abc = new BusinessLogic.DataView();
            DataSet ds = abc.FileData("Respondent_P" + Id);
            var data = JsonConvert.SerializeObject(ds.Tables[0]);
            var columns = cl.DataTableColumnToJsonObj(ds.Tables[0]);  //JsonConvert.SerializeObject(ds.Tables[0].Columns.ToString());
                                                                      //var data = ds.Tables[0];
            var jsonResult = Json(new { status = HttpStatusCode.OK, message = "Data Found", body = data, Columns = columns }, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

    }
}