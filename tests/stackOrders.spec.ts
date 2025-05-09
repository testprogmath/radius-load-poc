import { describe, it, expect, vi, beforeEach } from "vitest";
import { stackOrders } from "../src/commands/index.js";
import * as fproxy from "../src/utils/fproxy.js";
import * as api from "../src/api/dispatching-api.js";
import {AxiosHeaders} from "axios";
import * as ctOrder from "../src/commercetools/index.js";

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
    const stopMock = vi.fn();

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.spyOn(ctOrder, "getOrderId").mockImplementation(async (id: string) => `uuid-for-${id}`);
    });

    it("calls portForward and stacks orders correctly", async () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        vi.spyOn(fproxy, "portForward").mockResolvedValue({ port: 8080, stop: stopMock });
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

        expect(fproxy.portForward).toHaveBeenCalled();
        expect(api.sendStackingProposal).toHaveBeenCalledWith(
            "http://dispatching-hub-state-updater-staging.consumer-backend:8080",
            "de_ber_fran",
            ["uuid-for-1", "uuid-for-2"]
        );
        expect(api.fetchStackState).toHaveBeenCalled();
        expect(stopMock).toHaveBeenCalled();
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