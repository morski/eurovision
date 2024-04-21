using Eurovision.Models;
using Eurovision.Models.Database;
using Eurovision.Views;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Services
{
    public class RoomService : IRoomService
    {
        private readonly EurovisionContext _context;

        public RoomService(EurovisionContext context)
        {
            _context = context;
        }

        public bool LeaveRoom(int roomId, int userId)
        {
            var roomUser = _context.RoomUsers.FirstOrDefault(r => r.User.Id == userId && r.Room.Id == roomId);
            if(roomUser != null)
            {
                _context.Remove(roomUser);
                _context.SaveChanges();

                return true;
            }

            return false;
        }

        public RoomView CreateRoom(RoomRequest roomRequest, int userId)
        {
            try
            {
                if(string.IsNullOrWhiteSpace(roomRequest.Name))
                {
                    throw new Exception("Room name can't be empty");
                }

                if (string.IsNullOrWhiteSpace(roomRequest.Password))
                {
                    throw new Exception("Room password can't be empty");
                }

                var existingRoom = _context.Rooms.FirstOrDefault(r => r.Name.ToLower() == roomRequest.Name.ToLower());

                if(existingRoom != null)
                {
                    throw new Exception("Room name already taken");
                }

                var room = new Room
                {
                    Name = roomRequest.Name,
                    Password = roomRequest.Password,
                };

                _context.Rooms.Add(room);
                _context.SaveChanges();

                return JoinRoom(roomRequest, userId);
            }
            catch (Exception)
            {
                throw;
            }
            
        }

        public RoomView JoinRoom(RoomRequest roomRequest, int userId)
        {
            try
            {
                var room = _context.Rooms.FirstOrDefault(r => r.Name.ToLower() == roomRequest.Name.ToLower() && r.Password.ToLower() == roomRequest.Password.ToLower());
                var user = _context.Users.FirstOrDefault(u => u.Id == userId);
                if (room != null)
                {
                    var roomUser = new RoomUser
                    {
                        Room = room,
                        User = user
                    };

                    _context.RoomUsers.Add(roomUser);
                    _context.SaveChanges();

                    return new RoomView(room) ;
                }

                throw new Exception("Room not found. Please check room name and/or password");
            }
            catch (Exception)
            {
                throw;
            }
        }

        public RoomView[] GetAllRoomsForUser(int userId)
        {
            return _context.RoomUsers.Where(r => r.User.Id == userId).Select(r => new RoomView(r.Room)).ToArray();
        }
    }

    public interface IRoomService
    {
        public RoomView JoinRoom(RoomRequest roomRequest, int userId);

        public RoomView CreateRoom(RoomRequest roomRequest, int userId);

        public RoomView[] GetAllRoomsForUser(int userId);

        public bool LeaveRoom(int roomId, int userId);
    }
}
