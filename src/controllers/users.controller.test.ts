import dotenv from "dotenv";
dotenv.config();


import { mockNext, mockRequest, mockResponse } from "../__mocks__/http";
import { UsersController } from "./users.controller";
import UserService from "../services/user.service";

describe("Get Users Method", () => {
  it("Can get Users", async () => {
    const req = mockRequest({
      query: {
        offset: "3",
        limit: "60",
      }
    });
    const res = mockResponse();

    const getUsersSpy = jest.spyOn(UserService, "getUsers");
    getUsersSpy.mockResolvedValueOnce([{ id: "1", fullname: "john" }]);

    await UsersController.users(req, res, mockNext);

    expect(res.data).toBeCalledWith([{ id: "1", fullname: "john" }]);

    expect(getUsersSpy).toBeCalledWith("3", "60",
    ); 

  });
});
