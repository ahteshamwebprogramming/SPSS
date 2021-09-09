namespace SPSSUploadTest.Models
{
    public class UserInfo
    {
        private string username;
        private int userid;
        private string rolename;
        private string email;
        private string name;

        public UserInfo()
        {
        }
        public UserInfo(string username, int userid, string rolename, string email, string name)
        {
            this.username = username;
            this.userid = userid;
            this.rolename = rolename;
            this.email = email;
            this.name = name;
        }
        public void setUserName(string username) {
            this.username = username;
        }
    }
}