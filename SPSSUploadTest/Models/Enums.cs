using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SPSSUploadTest.Models
{
    public class Enums
    {
        public enum ProjectStatus {
            Active=1,
            Inactive=0
        }
        public enum ProjectType {
            FileUpload=1,
            Manually=2
        }
    }
}