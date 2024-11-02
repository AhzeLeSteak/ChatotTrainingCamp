using ChatotTrainingCamp.Models;
using ChatotTrainingCamp.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatotTrainingCamp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {

        private RoomHub roomService;

        public RoomController(RoomHub rs)
        {
            roomService = rs;
        }

        [HttpGet(Name = "CreateRoom")]
        public Room CreateRoom()
        {
            return null;
        }
    }
}
