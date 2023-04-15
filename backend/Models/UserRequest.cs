using System;
using System.Linq

namespace backend.Models
{
    public class UserRequest
    {
        public Guid record_guid { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set;}
    }
}
