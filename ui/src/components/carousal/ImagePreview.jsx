/* eslint-disable react/prop-types */
export const ImagePreview = ({ urls, title }) => {
  const validUrls = urls.filter(Boolean);

  if (!validUrls.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-3 gap-3">
        {validUrls.map((url, index) => (
          <div key={index} className="relative aspect-square group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
};