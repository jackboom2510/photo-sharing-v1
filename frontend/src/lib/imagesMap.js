const imageContext = require.context(
	"../images",
	false,
	/\.(png|jpe?g|svg)$/,
);

const images = imageContext.keys().reduce((acc, objKey) => {
	const cleanKey = objKey.replace("./", "");
	acc[cleanKey] = imageContext(objKey);
	return acc;
}, {});

export default images;
