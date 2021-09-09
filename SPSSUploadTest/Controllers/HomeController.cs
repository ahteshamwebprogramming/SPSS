using SpssLib.DataReader;
using SPSSUploadTest.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using c = SPSSUploadTest.BL.Common.CommonLogic;


namespace SPSSUploadTest.Controllers
{
    public class HomeController : Controller
    {
        SPSSTestEntities db = new SPSSTestEntities();
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Home()
        {
            BL.Home.Home home = new BL.Home.Home();
            ViewBag.Projects = home.FetchProjects("");
            return View();
        }
        public ActionResult QualityReport()
        {
            return View();
        }
        public ActionResult SearchProject(string ProjectName)
        {
            BL.Home.Home home = new BL.Home.Home();
            ViewBag.Projects = home.FetchProjects(ProjectName);
            return PartialView("_projectGrids");
        }
        public ActionResult Profile1()
        {
            return View();
        }
        public ActionResult DManagement()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult UploadSPSSFile(HttpPostedFileBase file)
        {
            try
            {
                if (file.ContentLength > 0)
                {
                    string _FileName = Path.GetFileName(file.FileName);
                    string ext = Path.GetExtension(file.FileName);


                    ProjectName projectName = new ProjectName();
                    projectName.ProjectName1 = _FileName;

                    db.ProjectNames.Add(projectName);
                    db.SaveChanges();
                    int id = projectName.Id;
                    string _path = Path.Combine(Server.MapPath("~/SPSSFiles"), id + ext);

                    file.SaveAs(_path);
                }
                ViewBag.Message = "File Uploaded Successfully!!";
                return View();
            }
            catch (Exception ex)
            {
                ViewBag.Message = "File upload failed!!";
                return View();
            }

        }

        public ActionResult ListFile()
        {
            ViewBag.Files = db.ProjectNames.ToList();
            return View();
        }
        public ActionResult ProcessFile(int Id)
        {
            try
            {
                //if (ReadSPSSFile(Id))
                if (true)
                {
                    ViewBag.Message = "Successfully Processed";
                    ViewBag.Variables = db.ProjectVariables.Where(x => x.ProjectID == Id).ToList();
                    ViewBag.Values = db.ProjectsValues.Where(x => x.ProjectID == Id).ToList();
                    //var NewTable = db.fetchNewCreatedDynamicTable("Respondent_P" + Id);
                    //DataTable dt = db.Database.ExecuteSqlCommand("Exec [dbo].fetchNewCreatedDynamicTable @tblName ", new SqlParameter("@tblName", "Respondent_P" + Id));
                    BusinessLogic.DataView abc = new BusinessLogic.DataView();
                    DataSet ds = abc.FileData("Respondent_P" + Id);
                    DataTable dt = ds.Tables[0];
                    ViewBag.filedata = dt;
                }
                else
                {
                    ViewBag.Message = "Some Error has occurred";
                }
            }
            catch (Exception ex)
            {
                ViewBag.Message = "Some Error has occurred";
            }
            return View();
        }
        public bool ReadSPSSFile(int Id)
        {
            try
            {
                db.deleteVariableValues(Id);

                BL.Common.CommonLogic commonLogic = new BL.Common.CommonLogic();
                //string filepath = @"C:\Users\mhdah\Desktop\Projects\SPSSTest\SPSSTest\StudyFiles\";
                string filepath = System.Web.Hosting.HostingEnvironment.MapPath("~/SPSSFiles/");
                using (FileStream fileStream = new FileStream(filepath + Id + ".sav", FileMode.Open, FileAccess.Read, FileShare.Read, 2048 * 10, FileOptions.SequentialScan))
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
                Response.Write("<script>alert('" + ex.Message + "')</script>");
                return false;
            }
        }

    }
}