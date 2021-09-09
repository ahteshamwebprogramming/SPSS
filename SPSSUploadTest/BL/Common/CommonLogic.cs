using System;
using System.Data;
using System.Globalization;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace SPSSUploadTest.BL.Common
{
    public class CommonLogic
    {
        public static void WriteErrorLog(string strError)
        {
            try
            {
                //string strLogPath= Server.MapPath("~/ErrorLogs/");
                string strLogPath = System.Web.Hosting.HostingEnvironment.MapPath("~/ErrorLogs/");
                string strFileNameSuffix = DateTime.Today.Date.Day.ToString() + "_" + DateTime.Today.Date.Month.ToString() + "_" + DateTime.Today.Date.Year.ToString() + ".log";
                string strLine = "";
                string strFileName = strLogPath + strFileNameSuffix;
                //DirectoryInfo logdir = new DirectoryInfo(strFileName);
                //if (!logdir.Exists)
                //    logdir.Create();
                //strLine = DateTime.Now.ToString() + "|" + strError;
                strLine = strError;
                if (!File.Exists(strFileName))
                {
                    FileStream f = File.Create(strFileName);
                    f.Close();
                }
                using (StreamWriter sw = File.AppendText(strFileName))
                {
                    sw.WriteLine(strLine);
                    sw.WriteLine("\n");
                    // tw.Close();
                    //tw.Dispose();
                }
            }
            catch (Exception ex)
            {
                // CreateLogFiles Err = new CreateLogFiles();
                // ErrorLog(Server.MapPath("ErrorLog"), ex.Message);
                // ClsCommon.WriteErrorLog("Error occured in Add User page on GetUserDetails()event : " + ex.Message);
                //string ErrMsg = ex.Message ;
            }
        }


        public static string Encrypt(string clearText)
        {

            string EncryptionKey = "MAKV2S54FUCKP99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }

        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "MAKV2S54FUCKP99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        public DateTime? ConvertToDateTime(string inputDateTime, string format)
        {
            //dd/MM/yyyy
            try
            {
                DateTime? dateTime;
                if (inputDateTime.Trim() != "")
                {
                    IFormatProvider culture = new CultureInfo("en-US", true);
                    dateTime = DateTime.ParseExact(inputDateTime, format, culture);
                }
                else
                {
                    dateTime = null;
                }
                return dateTime;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public string ConvertDatetimeToString(DateTime? input, string format)
        {
            try
            {
                if (input == null)
                {
                    return "";
                }
                else
                {
                    return (input ?? default(DateTime)).ToString(format);
                }
            }
            catch (Exception ex)
            {
                return "";
            }
        }

        public string ConvertStringDateTimeToString(object input, string format)
        {
            try
            {
                DateTime datetime = (DateTime)input;
                string outputdatetime = ConvertDatetimeToString(datetime, format);
                return outputdatetime;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public double ConvertToDouble0(string input)
        {
            double result;
            if (double.TryParse(input, out result) == true)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }
        public double? ConvertToDoubleNull(string input)
        {
            double result;
            if (double.TryParse(input, out result) == true)
            {
                return result;
            }
            else
            {
                return null;
            }
        }
        public int ConvertToInt0(string input)
        {
            int result;
            if (int.TryParse(input, out result) == true)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }
        public int? ConvertToIntNull(string input)
        {
            int result;
            if (int.TryParse(input, out result) == true)
            {
                return result;
            }
            else
            {
                return null;
            }
        }


        public string DataTableColumnToJsonObj(DataTable dt)
        {
            DataSet ds = new DataSet();
            ds.Merge(dt);
            StringBuilder JsonString = new StringBuilder();
            if (ds != null && ds.Tables[0].Columns.Count > 0)
            {
                JsonString.Append("[");
                //JsonString.Append("{");
                for (int i = 0; i < ds.Tables[0].Columns.Count; i++)
                {
                    if (ds.Tables[0].Columns.Count == (i + 1))
                    {
                        JsonString.Append("{\"" + i + "\":" + "\"" + ds.Tables[0].Columns[i].ColumnName.ToString() + "\"}");
                    }
                    else
                    {
                        JsonString.Append("{\"" + i + "\":" + "\"" + ds.Tables[0].Columns[i].ColumnName.ToString() + "\"},");
                    }

                }
                //JsonString.Append("}");
                JsonString.Append("]");
                return JsonString.ToString();
            }
            else
            {
                return null;
            }
        }


    }
}