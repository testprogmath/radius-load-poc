import { describe, it, expect, vi, beforeEach } from "vitest";
import { stackOrders } from "../src/commands/index.js";
import * as api from "../src/api/dispatching-api.js";
import {AxiosHeaders} from "axios";
import * as ctOrder from "../src/commercetools/index.js";
import {readAppConfig} from "../src/utils.js";
import {AppConfig} from "../src/config.js";

const sampleResponse = {
    data: {
        ID: "d7c8fbdd-1670-43f6-bf36-429837ba1828",
        Hub: "de_ber_fran",
        Revision: 347,
        TripProposals: [
            {
                FirstDelivery: {
                    ID: "35c80e56-987f-4654-8baf-ebd35abbff5b",
                    PDT: 12,
                    ETAAtCheckout: 11.5,
                },
                IndirectDeliveries: [
                    {
                        ID: "ec534f6e-d5bd-464d-8b09-24205b2fefbd",
                        PDT: 17,
                        ETAAtCheckout: 16.01,
                    },
                ],
            },
        ],
    },
};

describe("stackOrders", () => {
    let config: AppConfig;

    beforeEach(async () => {
        vi.restoreAllMocks();
        vi.spyOn(ctOrder, "getOrderId").mockImplementation(async (id: string) => `uuid-for-${id}`);
        config = await readAppConfig();
    });

    it("stacks orders correctly", async () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        vi.spyOn(api, "sendStackingProposal").mockResolvedValue({
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config: {
                headers: new AxiosHeaders(),
            },
        });
        vi.spyOn(api, "fetchStackState").mockResolvedValue({
            data: sampleResponse.data,
            status: 200,
            statusText: "OK",
            headers: {},
            config: {
                headers: new AxiosHeaders(),
            },
        });

        await stackOrders({
            hub: "de_ber_fran",
            orderIds: ["1", "2"],
        });

        expect(api.sendStackingProposal).toHaveBeenCalledWith(
            config.dispatchingApiUrl,
            "de_ber_fran",
            ["uuid-for-1", "uuid-for-2"],
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining("Bearer "),
                }),
            })
        );
        expect(api.fetchStackState).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("📦 Sending proposal..."));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("🧱 Stack ID: d7c8fbdd"));
    });

    it("exits early when less than 2 orderIds provided", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(process, "exit").mockImplementation((code?) => {
            throw new Error(`EXIT_${code}`);
        });

        try {
            await stackOrders({ hub: "de_ber_fran", orderIds: ["1"] });
        } catch (e: any) {
            expect(e.message).toBe("EXIT_1");
        }

        expect(errorSpy).toHaveBeenCalledWith("❌ You must provide at least two order IDs to stack them.");
    });
});