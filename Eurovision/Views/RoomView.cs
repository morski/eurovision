using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class RoomView
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public RoomView(Room room) 
        { 
            Id = room.Id;
            Name = room.Name;
        }
    }
}
