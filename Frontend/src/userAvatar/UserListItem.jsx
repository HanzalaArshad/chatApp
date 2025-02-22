const UserListItem = ({ user, handleFunction }) => {
  console.log("Rendering UserListItem with:", user); // Debugging
  return (
    <div 
      className="d-flex gap-4 bg-success text-white rounded mt-4 p-3" 
      onClick={() => handleFunction(user)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={user.pic}
        alt="User"
        className="rounded-circle img-fluid"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
      
      <div>
        <p>{user.name}</p>
        <p className="text-xs">
          <b>Email : </b>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
