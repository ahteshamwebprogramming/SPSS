using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web;
using C = SPSSUploadTest.BL.Common.CommonLogic;

namespace SPSSUploadTest.BusinessObject
{
    public class DB
    {
        BL.Common.CommonLogic objCom = new BL.Common.CommonLogic();
        SqlConnection con = null;
        string strConn = "", output = "", strqury = "", strBckupConn;
        SqlDataReader drUser = null, drSupplier = null;
        public DB()
        {
            strConn = ConfigurationManager.ConnectionStrings["SPSSTestConnection"].ConnectionString; //ConfigurationSettings.AppSettings["strconn"].ToString();
            con = new SqlConnection(strConn);
            //con = new SqlConnection(ConfigurationManager.AppSettings["srconn"]);
        }

        public DataSet ManipulateData(CommandType commandtype, string query)
        {
            DataSet ds = new DataSet();
            ds.Clear();
            try
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandText = query;
                cmd.CommandType = commandtype;
                SqlDataAdapter da1 = new SqlDataAdapter(cmd);
                da1.Fill(ds);
                //SqlDataReader reader = cmd.ExecuteReader();
                //if (reader.HasRows)
                //{
                //    while (reader.Read())
                //    { }
                //}
                //da=new SqlDataAdapter(new SqlCommand(){Connection=con,CommandType=commandType,CommandText="select from employee;select from employee2"});
                //DataSet ds = new DataSet();
                //da.Fill(ds);
            }
            catch (Exception e)
            {
                C.WriteErrorLog(e.Message);

                //System.Web.HttpContext.Current.Response.Write("<script>alert('" + e.Message + "');</script>");
                //Console.WriteLine(e.Message);
                System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : ") + e.Message) + "');</script>");
            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }

            }
            return ds;
        }
        public int ExecuteNonQuery(string qry, SqlParameter[] parm, CommandType commandtype)
        {
            DataSet ds = new DataSet();
            ds.Clear();
            int Returnvalue = 0;
            try
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlCommand cmd = new SqlCommand(qry, con);
                cmd.Connection = con;
                cmd.CommandText = qry;
                cmd.CommandType = commandtype;
                cmd.Parameters.AddRange(parm);
                Returnvalue = cmd.ExecuteNonQuery();
            }
            catch (Exception e)
            {
                System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : ") + e.Message) + "');</script>");
            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
            return Returnvalue;
        }
        public bool CheckData(string query)
        {
            DataSet ds = new DataSet();
            ds.Clear();
            bool ret = false;
            try
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlCommand cmd = new SqlCommand(query, con);

                SqlDataAdapter da = new SqlDataAdapter();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    ret = true;
                }
                else
                {
                    ret = false;
                }
            }
            catch (Exception e)
            {
                System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : ") + e.Message) + "');</script>");
            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
            return ret;
        }
        public DataSet ManipulateDataWithExtraParam(CommandType commandtype, string query, SqlParameter[] parm)
        {
            DataSet ds = new DataSet();
            // ds.Clear();
            //    SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["SchoolManagementConnectionString"].ConnectionString);

            try
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandText = query;
                cmd.CommandType = commandtype;
                cmd.Parameters.AddRange(parm);
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(ds);
                //SqlDataReader reader = cmd.ExecuteReader();
                //if (reader.HasRows)
                //{
                //    while (reader.Read())
                //    { }
                //}
                //da=new SqlDataAdapter(new SqlCommand(){Connection=con,CommandType=commandType,CommandText="select from employee;select from employee2"});
                //DataSet ds = new DataSet();
                //da.Fill(ds);
            }
            catch (Exception e)
            {
                if (Convert.ToInt64(((System.Runtime.InteropServices.ExternalException)e).ErrorCode) == -2146232060)
                {
                    System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : Please check your internet connection and try again ")) + "');</script>");
                }
                else
                    System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : ") + e.Message) + "');</script>");

                //Console.WriteLine(e.Message);

            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }
            }
            return ds;
        }

        public string ManipulateDataWithOutputParm(CommandType commandtype, string query, SqlParameter[] parm, SqlParameter paramout)
        {
            DataSet ds = new DataSet();
            ds.Clear();
            //    SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["SchoolManagementConnectionString"].ConnectionString);

            try
            {
                if (con.State == ConnectionState.Closed)
                {
                    con.Open();
                }
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandText = query;
                cmd.CommandType = commandtype;
                cmd.Parameters.AddRange(parm);
                cmd.Parameters.Add(paramout);
                paramout.Direction = ParameterDirection.Output;
                SqlDataReader sdr = cmd.ExecuteReader();
                string output = Convert.ToString(paramout.Value);
                return output;
                //SqlDataAdapter da = new SqlDataAdapter(cmd);
                //da.Fill(ds);
                //SqlDataReader reader = cmd.ExecuteReader();
                //if (reader.HasRows)
                //{
                //    while (reader.Read())
                //    { }
                //}
                //da=new SqlDataAdapter(new SqlCommand(){Connection=con,CommandType=commandType,CommandText="select from employee;select from employee2"});
                //DataSet ds = new DataSet();
                //da.Fill(ds);
            }
            catch (Exception e)
            {
                System.Web.HttpContext.Current.Response.Write("<script>alert('" + HttpContext.Current.Server.HtmlEncode(("Error : ") + e.Message) + "');</script>");
                //Console.WriteLine(e.Message);
                return "";
            }
            finally
            {
                if (con.State == ConnectionState.Open)
                {
                    con.Close();
                }

            }

        }
    }
}