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

        public bool LeaveRoom(Guid roomId, Guid userId)
        {
            var roomUser = _context.RoomUsers.FirstOrDefault(r => r.UserId == userId && r.RoomId == roomId);
            if(roomUser != null)
            {
                _context.Remove(roomUser);
                _context.SaveChanges();

                return true;
            }

            return false;
        }

        public RoomView CreateRoom(RoomRequest roomRequest, Guid userId)
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
                    Id = Guid.NewGuid(),
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

        public RoomView JoinRoom(RoomRequest roomRequest, Guid userId)
        {
            try
            {
                var room = _context.Rooms.FirstOrDefault(r => r.Name.ToLower() == roomRequest.Name.ToLower() && r.Password.ToLower() == roomRequest.Password.ToLower());

                if (room != null)
                {
                    var roomUser = new RoomUser
                    {
                        Id = Guid.NewGuid(),
                        RoomId = room.Id,
                        UserId = userId
                    };

                    _context.RoomUsers.Add(roomUser);
                    _context.SaveChanges();

                    return new RoomView { Id = room.Id, Name = room.Name };
                }

                throw new Exception("Room not found. Please check room name and/or password");
            }
            catch (Exception)
            {
                throw;
            }
        }

        public RoomView[] GetAllRoomsForUser(Guid userId)
        {
            return _context.RoomUsers.Include(r => r.Room).Where(r => r.UserId == userId).Select(r => new RoomView { Id = r.Room.Id, Name = r.Room.Name }).ToArray();
        }
    }

    public interface IRoomService
    {
        public RoomView JoinRoom(RoomRequest roomRequest, Guid userId);

        public RoomView CreateRoom(RoomRequest roomRequest, Guid userId);

        public RoomView[] GetAllRoomsForUser(Guid userId);

        public bool LeaveRoom(Guid roomId, Guid userId);
    }
}
