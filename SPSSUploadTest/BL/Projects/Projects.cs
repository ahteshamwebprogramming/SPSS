using SpssLib.DataReader;
using SPSSUploadTest.Models;
using System;
using System.Collections.Generic;
using System.IO;
using c = SPSSUploadTest.BL.Common.CommonLogic;
namespace SPSSUploadTest.BL.Projects
{
    public class Projects
    {
        SPSSTestEntities db = new SPSSTestEntities();
        public bool ReadSPSSFile(int Id)
        {
            try
            {

                db.deleteVariableValues(Id);

                BL.Common.CommonLogic commonLogic = new BL.Common.CommonLogic();
                string filepath = System.Web.Hosting.HostingEnvironment.MapPath("~/SPSSFiles/");

                using (FileStream fileStream = new FileStream(filepath + Id + ".sav", FileMode.Open, FileAccess.Read, FileShare.Read, 2048 * 10, FileOptions.SequentialScan))
                {

                    SpssReader spssDataset = new SpssReader(fileStream);
                    foreach (var variable in spssDataset.Variables)
                    {
                        ProjectVariable projectVariable = new ProjectVariable();
                        projectVariable.ProjectID = Id;
                        projectVariable.Variables = variable.Name;
                        if (variable.Type.ToString().Trim().ToUpper() == "TEXT")
                        {
                            projectVariable.Typs = "NVARCHAR(" + variable.TextWidth + ")";
                        }
                        else if (variable.Type.ToString().Trim().ToUpper() == "NUMERIC")
                        {
                            if (variable.PrintFormat.FormatType.ToString().ToUpper() == "DATETIME")
                            {
                                projectVariable.Typs = "DATETIME";
                            }
                            else
                            {
                                projectVariable.Typs = "INT";
                            }
                        }
                        else
                        {
                            projectVariable.Typs = "NVARCHAR(" + variable.TextWidth + ")";
                        }

                        projectVariable.UID = variable.ValueLabels.Count == 0 ? 1 : 0;
                        projectVariable.IsInt = (variable.Type.ToString().Trim().ToUpper() == "INT" ? 1 : 0);
                        projectVariable.Labels = variable.Label;
                        projectVariable.Measure = variable.MeasurementType.ToString();
                        projectVariable.TblName = "Respondent_P" + Id;
                        db.ProjectVariables.Add(projectVariable);
                        foreach (KeyValuePair<double, string> label in variable.ValueLabels)
                        {
                            ProjectsValue projectsValue = new ProjectsValue();
                            projectsValue.ProjectID = Id;
                            projectsValue.Variables = variable.Name;
                            projectsValue.Value = label.Key.ToString();
                            projectsValue.Labels = label.Value;
                            projectsValue.CreateDate = DateTime.Now;
                            db.ProjectsValues.Add(projectsValue);
                        }
                    }
                    db.SaveChanges();
                    c.WriteErrorLog("Database created");
                    var res = db.DynamicTableStructure_New(Id);
                    c.WriteErrorLog("Respondent Database Created");
                    foreach (var record in spssDataset.Records)
                    {
                        string queryStart = "INSERT INTO dbo.Respondent_P" + Id + "(";
                        string queryColumns = "";
                        string queryValues = "";
                        foreach (var variable in spssDataset.Variables)
                        {
                            Console.Write(variable.Name);
                            Console.Write(':');
                            Console.Write(record.GetValue(variable));
                            queryColumns += "[" + variable.Name + "],";
                            string vValue = ""; // record.GetValue(variable) == null ? "null" : record.GetValue(variable).ToString().Trim();
                            if (variable.Type.ToString().Trim().ToUpper() == "NUMERIC")
                            {
                                if (variable.PrintFormat.FormatType.ToString().ToUpper() == "DATETIME")
                                {

                                    vValue = record.GetValue(variable) == null ? "null," : "'" + commonLogic.ConvertStringDateTimeToString(record.GetValue(variable), "yyyy-MM-dd hh:mm:ss") + "',";
                                }
                                else
                                {
                                    vValue = record.GetValue(variable) == null ? "null," : record.GetValue(variable).ToString().Trim() + ",";
                                }

                            }
                            else
                            {
                                vValue = record.GetValue(variable) == null ? "null," : "'" + record.GetValue(variable).ToString().Trim().Replace("'", "''") + "',";
                            }
                            queryValues += vValue;
                        }
                        queryColumns = queryColumns.TrimEnd(',');
                        queryValues = queryValues.TrimEnd(',');
                        string query = queryStart + queryColumns + ")VALUES(" + queryValues + ")";
                        c.WriteErrorLog(query);
                        db.INSERTDynamicTableValues(query);
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                c.WriteErrorLog("Error " + ex.Message);
                return false;
            }
        }
    }
}