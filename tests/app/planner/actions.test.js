import { expect, it, describe } from "vitest";
import { getSchedulesDatesByUser } from "@/src/app/planner/actions";

describe("planner/actions.test.js", () => {
  describe("getSchedulesDatesByUser", () => {
    it("Should return 2", async () => {
      await expect(getSchedulesDatesByUser("teste@teste.com.br")).toBeTypeOf(
        "object",
      );
    });
  });
});
