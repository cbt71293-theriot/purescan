import { describe, it, expect } from "vitest";
import { db } from "$lib/stores/db.js";

describe("scan history", () => {
  it("stores and reads a scan record", async () => {
    const scanId = crypto.randomUUID();
    await db.scans.add({
      scanId,
      barcode: "3017760000123",
      productName: "Demo Product",
      brand: "DemoBrand",
      additivesJson: "[]",
      score: 80,
      scannedAt: new Date().toISOString()
    });

    const record = await db.scans.where("scanId").equals(scanId).first();
    expect(record).toBeDefined();
    expect(record?.productName).toBe("Demo Product");

    await db.scans.where("scanId").equals(scanId).delete();
  });
});
