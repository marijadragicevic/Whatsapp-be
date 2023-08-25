export const sendMessage = async (request, response, next) => {
  try {
    response.send("send message");
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (request, response, next) => {
  try {
    response.send("get messages");
  } catch (error) {
    next(error);
  }
};
