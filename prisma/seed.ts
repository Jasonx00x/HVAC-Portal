import { PrismaClient, Role, JobStatus, JobType, Priority, InvoiceStatus, ApprovalStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.setting.createMany({
    data: [
      { key: "companyName", value: "Hot & Cool Services" },
      { key: "defaultInvoiceTerms", value: "Net 30" },
      { key: "defaultMaterialMarkupPercent", value: "30" }
    ]
  });

  const jose = await prisma.employee.create({
    data: {
      name: "Jose Alfaro",
      role: Role.OWNER,
      phone: "(202) 555-0101",
      email: "jose@hotcool.local",
      hourlyRate: 65
    }
  });

  const angel = await prisma.employee.create({
    data: {
      name: "Angel Alfaro",
      role: Role.TECHNICIAN,
      phone: "(202) 555-0102",
      email: "angel@hotcool.local",
      hourlyRate: 38
    }
  });

  const oscar = await prisma.employee.create({
    data: {
      name: "Oscar Alfaro",
      role: Role.TECHNICIAN,
      phone: "(202) 555-0103",
      email: "oscar@hotcool.local",
      hourlyRate: 36
    }
  });

  const property = await prisma.property.create({
    data: {
      name: "Meridian Apartments",
      address: "1400 Meridian Pl NW",
      city: "Washington",
      state: "DC",
      zipCode: "20010",
      managerName: "Elena Brooks",
      managerPhone: "(202) 555-0140",
      managerEmail: "elena@meridian.example",
      billingContactName: "Meridian AP",
      billingEmail: "ap@meridian.example",
      accessInstructions: "Check in at front desk; ask for maintenance key ring.",
      parkingInstructions: "Use alley loading area before 10 AM, otherwise street parking.",
      buildingRules: "No torch work after 4 PM. Protect hallway floors.",
      refrigerantTypes: "R-410A, R-22 legacy units",
      commonWaterHeaterModels: "Bradford White 40 gal electric",
      poRequirementNotes: "PO required before invoices over $500 are paid.",
      approvalProcessNotes: "Send estimate to manager, then wait for written approval."
    }
  });

  const united = await prisma.supplier.create({
    data: {
      name: "United Refrigeration",
      accountNotes: "Confirm account pricing, stock, and will-call branch before sending technician.",
      website: "https://www.uri.com"
    }
  });

  const unitedBranch = await prisma.supplierBranch.create({
    data: {
      supplierId: united.id,
      name: "Capitol Heights / Jessup / Rockville area",
      state: "MD",
      notes: "Use nearest branch with stock for refrigerant, compressors, and HVAC/R replacement parts."
    }
  });

  await prisma.property.update({
    where: { id: property.id },
    data: {
      preferredSupplierId: united.id,
      pickupInstructions: "For larger unit or compressor pickups, confirm Maryland branch stock and will-call timing before dispatch."
    }
  });

  const unit = await prisma.unit.create({
    data: {
      propertyId: property.id,
      unitNumber: "315",
      floor: "3",
      accessNotes: "Tenant usually home after 5 PM."
    }
  });

  const equipment = await prisma.equipment.create({
    data: {
      propertyId: property.id,
      unitId: unit.id,
      type: "Condenser",
      brand: "Goodman",
      modelNumber: "GSX140301",
      serialNumber: "2305A10214",
      refrigerantType: "R-410A",
      tonnage: "2.5",
      dataPlatePhotoUrl: "/placeholder-data-plate.jpg"
    }
  });

  const completedJob = await prisma.job.create({
    data: {
      jobNumber: "HC-2026-1001",
      jobType: JobType.APARTMENT_COMMERCIAL,
      propertyId: property.id,
      unitId: unit.id,
      equipmentId: equipment.id,
      technicianId: angel.id,
      serviceType: "AC Repair",
      priority: Priority.HIGH,
      status: JobStatus.COMPLETED,
      scheduledAt: new Date("2026-06-10T09:00:00-04:00"),
      completedAt: new Date("2026-06-10T11:20:00-04:00"),
      problemReported: "Apartment not cooling.",
      diagnosis: "Failed dual capacitor and low return airflow.",
      workPerformed: "Replaced capacitor, washed condenser coil, verified split.",
      approvalStatus: ApprovalStatus.APPROVED,
      poNumber: "PO-78322"
    }
  });

  await prisma.materialUsed.createMany({
    data: [
      {
        jobId: completedJob.id,
        name: "45/5 MFD Dual Capacitor",
        category: "Electrical Parts",
        quantity: 1,
        unitCost: 28,
        totalCost: 28,
        supplier: "Johnstone Supply",
        shouldBill: true,
        addedToInvoice: false
      },
      {
        jobId: completedJob.id,
        name: "Coil cleaner",
        category: "HVAC Parts",
        quantity: 1,
        unitCost: 12,
        totalCost: 12,
        shouldBill: false,
        addedToInvoice: false
      }
    ]
  });

  await prisma.timesheet.create({
    data: {
      employeeId: angel.id,
      jobId: completedJob.id,
      date: new Date("2026-06-10T00:00:00-04:00"),
      clockIn: new Date("2026-06-10T09:00:00-04:00"),
      clockOut: new Date("2026-06-10T11:20:00-04:00"),
      totalHours: 2.33,
      approved: true
    }
  });

  const waitingJob = await prisma.job.create({
    data: {
      jobNumber: "HC-2026-1002",
      jobType: JobType.APARTMENT_COMMERCIAL,
      propertyId: property.id,
      unitId: unit.id,
      equipmentId: equipment.id,
      technicianId: oscar.id,
      serviceType: "Compressor Replacement",
      priority: Priority.NORMAL,
      status: JobStatus.WAITING_FOR_APPROVAL,
      scheduledAt: new Date("2026-06-11T13:00:00-04:00"),
      problemReported: "Outdoor unit trips breaker.",
      diagnosis: "Compressor grounded. Estimate needed.",
      approvalStatus: ApprovalStatus.ESTIMATE_SENT
    }
  });

  await prisma.approval.create({
    data: {
      jobId: waitingJob.id,
      estimateAmount: 1850,
      status: ApprovalStatus.ESTIMATE_SENT,
      sentDate: new Date("2026-06-11T14:00:00-04:00"),
      notes: "Waiting for manager approval and PO."
    }
  });

  await prisma.partNeeded.create({
    data: {
      jobId: waitingJob.id,
      name: "2.5 ton R-410A compressor",
      supplier: "United Refrigeration",
      estimatedCost: 720,
      ordered: false,
      received: false
    }
  });

  const compressorPickup = await prisma.supplierPickup.create({
    data: {
      supplierId: united.id,
      branchId: unitedBranch.id,
      partName: "2.5 ton R-410A compressor",
      ordered: false,
      readyForPickup: false,
      pickedUp: false,
      pickupBy: "Oscar Alfaro",
      pickupNotes: "Need manager approval and PO before ordering."
    }
  });

  await prisma.job.update({
    where: { id: waitingJob.id },
    data: { supplierPickupId: compressorPickup.id }
  });

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-2026-0501",
      jobId: completedJob.id,
      propertyId: property.id,
      unitId: unit.id,
      billingContact: "Meridian AP",
      billingEmail: "ap@meridian.example",
      invoiceDate: new Date("2026-06-10T00:00:00-04:00"),
      dueDate: new Date("2026-07-10T00:00:00-04:00"),
      poNumber: "PO-78322",
      status: InvoiceStatus.SENT,
      laborTotal: 279.6,
      materialsTotal: 0,
      discount: 0,
      total: 279.6
    }
  });

  await prisma.invoiceLineItem.create({
    data: {
      invoiceId: invoice.id,
      description: "AC diagnostic and repair labor",
      quantity: 2.33,
      unitPrice: 120,
      total: 279.6
    }
  });

  await prisma.inventoryItem.createMany({
    data: [
      { name: "R-410A cylinder", category: "Refrigerant", quantityInStock: 1, unitCost: 390, supplier: "United Refrigeration", reorderLevel: 2 },
      { name: "45/5 MFD Dual Capacitor", category: "Electrical Parts", quantityInStock: 3, unitCost: 28, supplier: "Johnstone Supply", reorderLevel: 4 },
      { name: "20x20x1 Filter", category: "Filters", quantityInStock: 18, unitCost: 5, supplier: "Home Depot Pro", reorderLevel: 12 }
    ]
  });

  await prisma.residentialClient.create({
    data: {
      name: "Maria Santos",
      address: "812 Kennedy St NE, Washington, DC 20011",
      phone: "(202) 555-0199",
      email: "maria@example.com",
      notes: "Occasional residential maintenance client."
    }
  });

  await prisma.communicationLog.create({
    data: {
      propertyId: property.id,
      date: new Date("2026-06-11T10:30:00-04:00"),
      contactName: "Elena Brooks",
      topic: "Compressor estimate",
      notes: "Manager requested written quote and PO before ordering compressor.",
      relatedJob: "HC-2026-1002",
      followUp: true
    }
  });

  console.log("Seeded HVAC Portal data for Hot & Cool Services.", { owner: jose.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
