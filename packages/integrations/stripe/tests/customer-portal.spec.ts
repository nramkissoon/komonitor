import * as GetStripe from "./../src/utils/getStripe";
import { apiResolver } from "next/dist/server/api-utils";
import fetch from "isomorphic-unfetch";
import http from "http";
import listen from "test-listen";
import { createCustomerPortalSessionMiddleware } from "./../src/customerPortal";
import sinon from "sinon";
import Stripe from "stripe";

const createServerAndGetResponse = async (requestHandler: any) => {
  let server = http.createServer(requestHandler);
  let url = await listen(server);
  let response = await fetch(url, { redirect: "manual" });
  server.close();

  return response;
};

describe("createCustomerPortalSessionMiddleware", () => {
  const stripe = new Stripe("test", { apiVersion: "2020-08-27" });
  let getStripeStub: sinon.SinonStub<[stripeSecretKey: string], Stripe>;

  beforeEach(() => {
    getStripeStub = sinon
      .stub(GetStripe, "serverSideGetStripe")
      .returns(stripe);
  });
  afterEach(() => {
    getStripeStub.restore();
  });

  it("successfully creates session and redirects", async () => {
    expect.assertions(2);
    const stripeStub = sinon
      .stub(stripe.billingPortal.sessions, "create")
      .returns(<any>{ url: "http://test.com" });

    const getCustomerId = (userId: string) => "id";

    let requestHandler = (req: any, res: any) => {
      req.method = "POST";
      req.body = { userId: "id" };

      const handler = async (req, res) => {
        await createCustomerPortalSessionMiddleware(
          "returnUrl",
          "test",
          getCustomerId,
          req,
          res
        );
      };

      return apiResolver(req, res, undefined, handler, undefined, false);
    };

    let response = await createServerAndGetResponse(requestHandler);

    expect(response.status).toEqual(302);
    expect(response.headers.get("location")).toEqual("http://test.com/");

    stripeStub.restore();
  });

  it("400 error when no user id", async () => {
    expect.assertions(1);
    const getCustomerId = (userId: string) => "id";

    let requestHandler = (req: any, res: any) => {
      req.method = "POST";
      req.body = {};

      const handler = async (req, res) => {
        await createCustomerPortalSessionMiddleware(
          "returnUrl",
          "test",
          getCustomerId,
          req,
          res
        );
      };

      return apiResolver(req, res, undefined, handler, undefined, false);
    };

    let response = await createServerAndGetResponse(requestHandler);

    expect(response.status).toEqual(400);
  });

  it("500 error when no customer id", async () => {
    expect.assertions(1);
    const getCustomerId = (userId: string) => {
      throw new Error("error");
    };

    let requestHandler = (req: any, res: any) => {
      req.method = "POST";
      req.body = { userId: "id" };

      const handler = async (req, res) => {
        await createCustomerPortalSessionMiddleware(
          "returnUrl",
          "test",
          getCustomerId,
          req,
          res
        );
      };

      return apiResolver(req, res, undefined, handler, undefined, false);
    };

    let response = await createServerAndGetResponse(requestHandler);

    expect(response.status).toEqual(500);
  });

  it("405 error when not POST request", async () => {
    expect.assertions(2);
    const getCustomerId = (userId: string) => "id";

    let requestHandler = (req: any, res: any) => {
      req.method = "GET";
      req.body = { userId: "id" };

      const handler = async (req, res) => {
        await createCustomerPortalSessionMiddleware(
          "returnUrl",
          "test",
          getCustomerId,
          req,
          res
        );
      };

      return apiResolver(req, res, undefined, handler, undefined, false);
    };

    let response = await createServerAndGetResponse(requestHandler);

    expect(response.headers.get("Allow")).toEqual("POST");
    expect(response.status).toEqual(405);
  });
});
