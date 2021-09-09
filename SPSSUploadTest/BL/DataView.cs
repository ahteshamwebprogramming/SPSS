using System.Data;
using System.Data.SqlClient;

namespace SPSSUploadTest.BusinessLogic
{
    public class DataView
    {
        public DataSet FileData(string TableName)
        {
            BusinessObject.DB dB = new BusinessObject.DB();
            SqlParameter[] parm = new SqlParameter[1];
            parm[0] = new SqlParameter("@tblName", TableName);
            DataSet ds = dB.ManipulateDataWithExtraParam(CommandType.StoredProcedure, "fetchNewCreatedDynamicTable", parm);
            return ds;
        }
    }
}