
// Reusable MetricCard component
// eslint-disable-next-line react/prop-types
const MetricCard = ({ icon: Icon, bgColor, title, value }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
      <div className={`${bgColor} p-2 rounded-full text-white`}>
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-gray-500 text-xs">{title}</h2>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
