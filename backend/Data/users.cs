using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Data
{
    public class users
    {
        public Guid record_guid { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
    }
}
