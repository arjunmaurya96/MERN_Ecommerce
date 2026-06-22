const UserStatCard = ({ title, value }) => {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm">
        <div className="card-body text-center">
          <h6 className="text-muted">{title}</h6>
          <h3>{value}</h3>
        </div>
      </div>
    </div>
  );
};

export default UserStatCard;
