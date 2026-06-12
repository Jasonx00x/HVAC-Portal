export type ImportedInvoiceRow = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  serviceDescription: string;
  amount: number;
  paidText: string;
  status: string;
  poNumber: string;
  source: "Imported tracker";
  managementCompany: string;
  propertyName: string;
  cleanupFlags: string[];
};

export const importedInvoiceRows: ImportedInvoiceRow[] = [
  {
    "id": "imported-row-1",
    "invoiceNumber": "J-000008",
    "customer": "Paradigmcos",
    "date": "2025-06-13",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit",
    "amount": 1750.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-2",
    "invoiceNumber": "J-000009",
    "customer": "Paradigmcos",
    "date": "2025-06-13",
    "serviceDescription": "Plumbing Leak",
    "amount": 785.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-3",
    "invoiceNumber": "J-000010",
    "customer": "Paradigmcos",
    "date": "2025-06-16",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit",
    "amount": 1750.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-4",
    "invoiceNumber": "J-000011",
    "customer": "Paradigmcos",
    "date": "2025-06-20",
    "serviceDescription": "Water Heater Replacement + Reimbursements",
    "amount": 1587.96,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-5",
    "invoiceNumber": "J-000012",
    "customer": "Paradigmcos",
    "date": "2025-06-20",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit",
    "amount": 1750.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-6",
    "invoiceNumber": "J-000013",
    "customer": "Paradigmcos",
    "date": "2025-06-26",
    "serviceDescription": "Full HVAC Replacement + Refrigerant",
    "amount": 2000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-7",
    "invoiceNumber": "J-000014",
    "customer": "Paradigmcos",
    "date": "2025-07-02",
    "serviceDescription": "Water Heater Replacement",
    "amount": 1475.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-8",
    "invoiceNumber": "J-000015",
    "customer": "Ashton at Dulles Corner",
    "date": "2025-06-27",
    "serviceDescription": "Diagnostics (Apt 481, 402, 451, 455, 457)",
    "amount": 450.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Ashton at Dulles Corner",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-9",
    "invoiceNumber": "J-000016",
    "customer": "Ashton at Dulles Corner",
    "date": "2025-06-28",
    "serviceDescription": "Replaced condenser unit (Apt 427)",
    "amount": 3800.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Ashton at Dulles Corner",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-10",
    "invoiceNumber": "J-000017",
    "customer": "Ashton at Dulles Corner",
    "date": "2025-07-02",
    "serviceDescription": "Hallway diagnostics & repairs",
    "amount": 1180.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Ashton at Dulles Corner",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-11",
    "invoiceNumber": "J-000018",
    "customer": "Alate Old Town",
    "date": "2025-07-03",
    "serviceDescription": "Emergency HVAC diagnostic (APT 304)",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-12",
    "invoiceNumber": "J-000019",
    "customer": "Alate Old Town",
    "date": "2025-07-07",
    "serviceDescription": "Emergency trip charge",
    "amount": 125.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-13",
    "invoiceNumber": "J-000020",
    "customer": "Paradigmcos",
    "date": "2025-07-07",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit PO#  MG-13224",
    "amount": 1750.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13224",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-14",
    "invoiceNumber": "J-000021",
    "customer": "Alate Old Town",
    "date": "2025-07-09",
    "serviceDescription": "Emergency Diagnostic (Apt 504)",
    "amount": 175.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-15",
    "invoiceNumber": "J-000022",
    "customer": "Paradigmcos",
    "date": "2025-07-11",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit PO# MG-13236",
    "amount": 1750.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13236",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-16",
    "invoiceNumber": "J-000023",
    "customer": "Alate Old Town",
    "date": "2025-07-11",
    "serviceDescription": "Overchraged Refrigerant (Apt 504)",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-17",
    "invoiceNumber": "J-000024",
    "customer": "Paradigmcos",
    "date": "2025-07-17",
    "serviceDescription": "Drain Leak in mechanical room. PO# MG-13245",
    "amount": 780.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13245",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-18",
    "invoiceNumber": "J-000025",
    "customer": "Alate Old Town",
    "date": "2025-07-29",
    "serviceDescription": "Diagnosed Apartment 422: It was low on refrigerant so I added some 410A refrigerant.",
    "amount": 660.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-19",
    "invoiceNumber": "J-000026",
    "customer": "Townes at Herndon",
    "date": "2025-07-30",
    "serviceDescription": "Replaced water heater piping(Expansion Tank, Mixing Valve and all other materials) 602L",
    "amount": 1700.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-20",
    "invoiceNumber": "J-000027",
    "customer": "Paradigmcos",
    "date": "2025-07-31",
    "serviceDescription": "HVAC Replacement – Condenser & Air Handling Unit PO#  MG-13224 APT 1117",
    "amount": 2000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13224",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-21",
    "invoiceNumber": "J-000028",
    "customer": "Alate Old Town",
    "date": "2025-08-01",
    "serviceDescription": "Diagnosed Apartment 104: It was wired incorrectly at the condensor and it was also low on refrigerant so I added some 410A refrigerant.",
    "amount": 660.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-22",
    "invoiceNumber": "J-000029",
    "customer": "Alate Old Town",
    "date": "2025-08-05",
    "serviceDescription": "Diagnosed Apartment 504: Burnt PCB(Printed Circuit Board)",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-23",
    "invoiceNumber": "J-000030",
    "customer": "Paradigmcos",
    "date": "2025-08-05",
    "serviceDescription": "Water Heater Replacement(APT 723 & PO#MG-13313 )",
    "amount": 1475.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13313",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-24",
    "invoiceNumber": "J-000031",
    "customer": "Townes at Herndon",
    "date": "2025-08-07",
    "serviceDescription": "Replace a Washing Machine (#830N)",
    "amount": 150.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-25",
    "invoiceNumber": "J-000032",
    "customer": "Townes at Herndon",
    "date": "2025-08-09",
    "serviceDescription": "Diagnosed HVAC systems for Townhouse  604L, 617L, and 605L",
    "amount": 600.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-26",
    "invoiceNumber": "J-000033",
    "customer": "Paradigmcos",
    "date": "2025-08-13",
    "serviceDescription": "HVAC Replacement (APT 201) – Condenser only",
    "amount": 3700.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-27",
    "invoiceNumber": "J-000034",
    "customer": "Paradigmcos",
    "date": "2025-08-14",
    "serviceDescription": "HVAC Replacement (APT 1403) – Condenser & Air Handling Unit PO#  MG - 13321",
    "amount": 3650.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13321",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-28",
    "invoiceNumber": "J-000035",
    "customer": "Paradigmcos",
    "date": "2025-08-14",
    "serviceDescription": "HVAC Replacement (APT 113) – Condenser & Air Handling Unit PO#  MG",
    "amount": 3850.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-29",
    "invoiceNumber": "J-000036",
    "customer": "Townes at Herndon",
    "date": "2025-08-14",
    "serviceDescription": "Service Call: Diagnosed HVAC System for Townhouse 642L",
    "amount": 175.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-30",
    "invoiceNumber": "J-000037",
    "customer": "Townes at Herndon",
    "date": "2025-08-16",
    "serviceDescription": "Service Call: Diagnosed HVAC System for Townhouse 642L",
    "amount": 175.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-31",
    "invoiceNumber": "J-000038",
    "customer": "Paradigmcos",
    "date": "2025-08-19",
    "serviceDescription": "Water Heater Replacement(APT 612, PO# MG-13347)",
    "amount": 1598.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13347",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-32",
    "invoiceNumber": "J-000039",
    "customer": "Paradigmcos",
    "date": "2025-08-25",
    "serviceDescription": "HVAC Replacement (Pool Area Bathrooms) – Condenser PO#  MG-13357",
    "amount": 1200.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13357",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-33",
    "invoiceNumber": "J-000040",
    "customer": "Paradigmcos",
    "date": "2025-08-26",
    "serviceDescription": "Air Handling Units x4  PO# MG-13370",
    "amount": 7160.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13370",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-34",
    "invoiceNumber": "J-000041",
    "customer": "Alate Old Town",
    "date": "2025-08-27",
    "serviceDescription": "Replaced Main Board(PCB), Compressor, Noise Filter APT 504",
    "amount": 1650.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-35",
    "invoiceNumber": "J-000042",
    "customer": "Paradigmcos",
    "date": "2025-08-28",
    "serviceDescription": "HVAC Replacement (APT 1125) – Condenser & Air Handling Unit PO#  MG-13371",
    "amount": 2000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13371",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-36",
    "invoiceNumber": "J-000043",
    "customer": "Paradigmcos",
    "date": "2025-08-28",
    "serviceDescription": "HVAC Replacement (APT 1311) – Condenser & Air Handling Unit PO#  MG-13380",
    "amount": 2000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13380",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-37",
    "invoiceNumber": "J-000044",
    "customer": "Townes at Herndon",
    "date": "2025-08-28",
    "serviceDescription": "Service Call: Diagnosed HVAC System for Townhouse 558C",
    "amount": 385.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-38",
    "invoiceNumber": "J-000045",
    "customer": "Townes at Herndon",
    "date": "2025-08-29",
    "serviceDescription": "Replaced water heater piping(Expansion Tank, Mixing Valve and all other materials) 578C",
    "amount": 1950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-39",
    "invoiceNumber": "J-000046",
    "customer": "Alate Old Town",
    "date": "2025-09-02",
    "serviceDescription": "Diagnosed Apartment 504: Added 410A Refrigerant",
    "amount": 660.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-40",
    "invoiceNumber": "J-000047",
    "customer": "Paradigmcos",
    "date": "2025-09-05",
    "serviceDescription": "HVAC Replacement (APT 412) – Condenser & Air Handling Unit PO#  MG-13397",
    "amount": 5975.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13397",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-41",
    "invoiceNumber": "J-000048",
    "customer": "Townes at Herndon",
    "date": "2025-09-06",
    "serviceDescription": "Service Call: Diagnosed HVAC System for Leak - Townhouse 822N",
    "amount": 275.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-42",
    "invoiceNumber": "J-000049",
    "customer": "Townes at Herndon",
    "date": "2025-09-09",
    "serviceDescription": "Service Call: Add filter Drier to Townhouse 822N",
    "amount": 255.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-43",
    "invoiceNumber": "J-000050",
    "customer": "The Clarendon Apartments",
    "date": "2025-09-10",
    "serviceDescription": "Service Call: Diagnosed Apartment 138",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-44",
    "invoiceNumber": "J-000051",
    "customer": "Paradigmcos",
    "date": "2025-09-10",
    "serviceDescription": "Water Heater Replacement(APT 905, PO# MG-13406)",
    "amount": 1475.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13406",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-45",
    "invoiceNumber": "J-000052",
    "customer": "Paradigmcos",
    "date": "2025-09-12",
    "serviceDescription": "Water Heater Replacement(APT 830, PO# MG-13408)",
    "amount": 1050.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13408",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-46",
    "invoiceNumber": "J-000053",
    "customer": "Paradigmcos",
    "date": "2025-09-12",
    "serviceDescription": "Water Heater Replacement(APT 718, PO# MG-13408)",
    "amount": 1050.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13408",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-47",
    "invoiceNumber": "J-000054",
    "customer": "Paradigmcos",
    "date": "2025-09-12",
    "serviceDescription": "HVAC Replacement (APT 911) – Condenser & Air Handling Unit PO#  MG-13411",
    "amount": 5035.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13411",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-48",
    "invoiceNumber": "J-000055",
    "customer": "Townes at Herndon",
    "date": "2025-09-13",
    "serviceDescription": "Replaced Stackable Washing Machine and Dryer( Townhouse 591L)",
    "amount": 300.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-49",
    "invoiceNumber": "J-000056",
    "customer": "Townes at Herndon",
    "date": "2025-09-15",
    "serviceDescription": "Replaced Washing Machine( Townhouse 617J)",
    "amount": 150.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-50",
    "invoiceNumber": "J-000057",
    "customer": "Paradigmcos",
    "date": "2025-09-15",
    "serviceDescription": "Water Heater Replacement(APT 616, PO# MG-13408)",
    "amount": 1185.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13408",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-51",
    "invoiceNumber": "J-000058",
    "customer": "Paradigmcos",
    "date": "2025-09-15",
    "serviceDescription": "Water Heater Replacement(APT 627, PO# MG-13408)",
    "amount": 1095.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13408",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-52",
    "invoiceNumber": "J-000059",
    "customer": "Paradigmcos",
    "date": "2025-09-16",
    "serviceDescription": "Water Heater Replacement(APT 413, PO# MG-13423)",
    "amount": 2100.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13423",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-53",
    "invoiceNumber": "J-000060",
    "customer": "Paradigmcos",
    "date": "2025-09-16",
    "serviceDescription": "HVAC Replacement (APT 1115) – Condenser & Air Handling Unit PO#  MG-13411",
    "amount": 4085.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13411",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-54",
    "invoiceNumber": "J-000061",
    "customer": "Alate Old Town",
    "date": "2025-09-17",
    "serviceDescription": "Diagnosed Apartment 504: Sensor Lock-Out Mode. We had to do a hard reset to the system and powered it back on to run appropietly.",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-55",
    "invoiceNumber": "J-000062",
    "customer": "The Clarendon Apartments",
    "date": "2025-09-18",
    "serviceDescription": "Service Call: Diagnosed Apartment 330 - (Leak in Condensor Unit, Replaced 3/8 service valve, Recharged system with 438 Freon)",
    "amount": 750.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-56",
    "invoiceNumber": "J-000063",
    "customer": "Paradigmcos",
    "date": "2025-09-19",
    "serviceDescription": "Water Heater Replacement(APT 401, PO# MG-13413)",
    "amount": 1050.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13413",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-57",
    "invoiceNumber": "J-000064",
    "customer": "The Clarendon Apartments",
    "date": "2025-09-19",
    "serviceDescription": "Service Call: Diagnosed Apartment 256 - ( No 24 volts power, Bad thermostat, replaced and provided by leasing office",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-58",
    "invoiceNumber": "J-000065",
    "customer": "Paradigmcos",
    "date": "2025-09-22",
    "serviceDescription": "Water Heater Replacement(APT 434, PO# MG-13464)",
    "amount": 1050.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13464",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-59",
    "invoiceNumber": "J-000066",
    "customer": "The Clarendon Apartments",
    "date": "2025-09-23",
    "serviceDescription": "Service Call: Diagnosed Apartment 256. There was nothing wrong with the unit. Everthimg was working as it should be.",
    "amount": 195.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-60",
    "invoiceNumber": "J-000067",
    "customer": "Paradigmcos",
    "date": "2025-09-23",
    "serviceDescription": "Water Heater Replacement(APT 923, PO# MG-13464)",
    "amount": 1140.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13464",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-61",
    "invoiceNumber": "J-000068",
    "customer": "Townes at Herndon",
    "date": "2025-09-24",
    "serviceDescription": "Replace Pressure Regulating Valve in Townhouse #731L",
    "amount": 496.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-62",
    "invoiceNumber": "J-000069",
    "customer": "Paradigmcos",
    "date": "2025-09-25",
    "serviceDescription": "Water Heater Replacement(APT 1422, PO# MG-13464)",
    "amount": 1140.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13464",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-63",
    "invoiceNumber": "J-000070",
    "customer": "Paradigmcos",
    "date": "2025-09-26",
    "serviceDescription": "Water Heater Replacement(APT 206, PO# MG-13464)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13464",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-64",
    "invoiceNumber": "J-000071",
    "customer": "Alate Old Town",
    "date": "2025-10-01",
    "serviceDescription": "Service Call; Diagnosed apartment 202, 609, 424",
    "amount": 645.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-65",
    "invoiceNumber": "J-000072",
    "customer": "Paradigmcos",
    "date": "2025-10-01",
    "serviceDescription": "HVAC Replacement (APT 1420) – Condenser & Air Handling Unit PO#  MG-13454",
    "amount": 5935.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13454",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-66",
    "invoiceNumber": "J-000073",
    "customer": "Paradigmcos",
    "date": "2025-10-02",
    "serviceDescription": "HVAC Replacement (APT 504) – Condenser & Air Handling Unit PO#  MG-13454",
    "amount": 6885.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13454",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-67",
    "invoiceNumber": "J-000074",
    "customer": "Townes at Herndon",
    "date": "2025-10-02",
    "serviceDescription": "Service Call: Diagnosed Water Heater for townhouse 631L ( Faulty Gas Ignition Valve)",
    "amount": 355.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-68",
    "invoiceNumber": "J-000075",
    "customer": "Paradigmcos",
    "date": "2025-10-03",
    "serviceDescription": "Water Heater Replacement(APT 1204, PO# MG-13457)",
    "amount": 1315.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13457",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-69",
    "invoiceNumber": "J-000076",
    "customer": "Paradigmcos",
    "date": "2025-10-03",
    "serviceDescription": "Leak Repair (APT 1029, PO# MG-13457)",
    "amount": 795.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13457",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-70",
    "invoiceNumber": "J-000077",
    "customer": "Paradigmcos",
    "date": "2025-10-06",
    "serviceDescription": "Plumbing Repair in mechanical room( APT 102, PO# MG-13512)",
    "amount": 765.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13512",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-71",
    "invoiceNumber": "J-000078",
    "customer": "Paradigmcos",
    "date": "2025-10-07",
    "serviceDescription": "HVAC Replacement (APT 815) – Condenser & Air Handling Unit PO#  MG-13466",
    "amount": 5935.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13466",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-72",
    "invoiceNumber": "J-000079",
    "customer": "Paradigmcos",
    "date": "2025-10-10",
    "serviceDescription": "HVAC Replacement (APT 305) – Condenser & Air Handling Unit PO#  MG-13511",
    "amount": 5935.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13511",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-73",
    "invoiceNumber": "J-000080",
    "customer": "Townes at Herndon",
    "date": "2025-10-10",
    "serviceDescription": "Refrigerant Leak repair for townhouse #812N",
    "amount": 325.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-74",
    "invoiceNumber": "J-000081",
    "customer": "Paradigmcos",
    "date": "2025-10-16",
    "serviceDescription": "HVAC Replacement (APT 1007) – Condenser & Air Handling Unit PO#  MG-13483",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13483",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-75",
    "invoiceNumber": "J-000082",
    "customer": "Alate Old Town",
    "date": "2025-10-16",
    "serviceDescription": "Leak fix for Apartment 202 and 609",
    "amount": 1300.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-76",
    "invoiceNumber": "J-000083",
    "customer": "Paradigmcos",
    "date": "2025-10-23",
    "serviceDescription": "HVAC Replacement (APT 608) – Condenser & Air Handling Unit PO# MG-13513",
    "amount": 6875.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13513",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-77",
    "invoiceNumber": "J-000084",
    "customer": "Townes at Herndon",
    "date": "2025-10-23",
    "serviceDescription": "Leak Diagnosed: Townhouse 722L",
    "amount": 175.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-78",
    "invoiceNumber": "J-000085",
    "customer": "The Clarendon Apartments",
    "date": "2025-10-24",
    "serviceDescription": "Service Call: Clean Evaporating Coil in Apartment 411",
    "amount": 495.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-79",
    "invoiceNumber": "J-000086",
    "customer": "Paradigmcos",
    "date": "2025-10-29",
    "serviceDescription": "Water Heater Replacement(APT 608 , PO# MG-13513)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13513",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-80",
    "invoiceNumber": "J-000087",
    "customer": "Paradigmcos",
    "date": "2025-11-03",
    "serviceDescription": "Water Heater Replacement(APT 1329 , PO# MG-13528)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13528",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-81",
    "invoiceNumber": "J-000088",
    "customer": "Townes at Herndon",
    "date": "2025-11-04",
    "serviceDescription": "Replace a compressor Townhouse 722L",
    "amount": 850.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-82",
    "invoiceNumber": "J-000089",
    "customer": "Paradigmcos",
    "date": "2025-11-05",
    "serviceDescription": "Water Heater Replacement(APT 813 , PO# MG-13528)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13528",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-83",
    "invoiceNumber": "J-000090",
    "customer": "Paradigmcos",
    "date": "2025-11-06",
    "serviceDescription": "Water Heater Replacement(APT 601 , PO# MG-13528)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13528",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-84",
    "invoiceNumber": "J-000091",
    "customer": "Townes at Herndon",
    "date": "2025-11-11",
    "serviceDescription": "Water Heater Repipipe Townhouse 650L",
    "amount": 1950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-85",
    "invoiceNumber": "J-000092",
    "customer": "Alate old Town",
    "date": "2025-11-13",
    "serviceDescription": "Service Call: Diagnosed Condensation Issues in the VRF Systems for the",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-86",
    "invoiceNumber": "J-000093",
    "customer": "Paradigmcos",
    "date": "2025-11-14",
    "serviceDescription": "Water Heater Replacement(APT 425  , PO# MG-13551)",
    "amount": 1185.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13551",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-87",
    "invoiceNumber": "J-000094",
    "customer": "Townes at Herndon",
    "date": "2025-11-15",
    "serviceDescription": "Water Heater Repipipe Townhouse 725L",
    "amount": 1950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-88",
    "invoiceNumber": "J-000095",
    "customer": "Townes at Herndon",
    "date": "2025-11-15",
    "serviceDescription": "Service Call: Replace Mixing Valve in Townhouse 624L",
    "amount": 350.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-89",
    "invoiceNumber": "J-000096",
    "customer": "The Clarendon Apartments",
    "date": "2025-11-17",
    "serviceDescription": "HVAC Replacement (APT 435) – Condenser & Air Handling Unit",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-90",
    "invoiceNumber": "J-000097",
    "customer": "Paradigmcos",
    "date": "2025-11-18",
    "serviceDescription": "Water Heater Replacement(APT 106  , PO# MG-13558)",
    "amount": 1185.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13558",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-91",
    "invoiceNumber": "J-000098",
    "customer": "The Calrendon Apartments",
    "date": "2025-11-19",
    "serviceDescription": "Service Call: Run a new thermostate Wire from the air handler to the thermostat control",
    "amount": 585.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-92",
    "invoiceNumber": "J-000099",
    "customer": "Paradigmcos",
    "date": "2025-11-20",
    "serviceDescription": "HVAC Replacement (APT 1012) – Condenser & Air Handling Unit PO#  MG-13623",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13623",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-93",
    "invoiceNumber": "J-000100",
    "customer": "Paradigmcos/ Ballston",
    "date": "2025-11-21",
    "serviceDescription": "Service Call: Replace Hydronic Coil for Apartment #718 PO:MB21872",
    "amount": 565.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MB21872",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": []
  },
  {
    "id": "imported-row-94",
    "invoiceNumber": "J-000101",
    "customer": "Paradigmcos",
    "date": "2025-11-21",
    "serviceDescription": "Water Heater Replacement(APT 521  , PO# MG-13622)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13622",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-95",
    "invoiceNumber": "J-000102",
    "customer": "Paradigmcos",
    "date": "2025-11-25",
    "serviceDescription": "Water Heater Replacement(APT 1132  , PO# MG-13622)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13622",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-96",
    "invoiceNumber": "J-000103",
    "customer": "Alate Old Town",
    "date": "2025-11-26",
    "serviceDescription": "Service Call: Diagnosed APT 425 ; High Voltage tripping out the breaker locking out the heating system",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-97",
    "invoiceNumber": "J-000104",
    "customer": "Paradigmcos",
    "date": "2025-12-05",
    "serviceDescription": "Water Heater Replacement (APT 427  , PO# MG-13606)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13606",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-98",
    "invoiceNumber": "J-000105",
    "customer": "Paradigmcos",
    "date": "2025-12-05",
    "serviceDescription": "Drain leak in mechanical room (APT 218 ,PO# MG-13605)",
    "amount": 298.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13605",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-99",
    "invoiceNumber": "J-000106",
    "customer": "Paradigmcos/ Ballston",
    "date": "2025-12-08",
    "serviceDescription": "Service Call: Replace Hydronic Coil for Apartment #1816 PO:MB21894",
    "amount": 565.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MB21894",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": []
  },
  {
    "id": "imported-row-100",
    "invoiceNumber": "J-000107",
    "customer": "Alate Old Town",
    "date": "2025-12-08",
    "serviceDescription": "Service Call: Replace Filters for the VRF systems in the main entrance of building and Dinning/ party room",
    "amount": 1500.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-101",
    "invoiceNumber": "J-000108",
    "customer": "Alate Old Town",
    "date": "2025-12-08",
    "serviceDescription": "Service Call: Diagnosed Apt425, Apt 225, Apt403",
    "amount": 1075.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-102",
    "invoiceNumber": "J-000109",
    "customer": "Paradigmcos",
    "date": "2025-12-09",
    "serviceDescription": "Replace Washing Machine Outlet Box Apt 1301  PO#13624",
    "amount": 435.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "13624",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-103",
    "invoiceNumber": "J-000110",
    "customer": "Alate Old Town",
    "date": "2025-12-09",
    "serviceDescription": "Service Call: Fixed Apt 425 and 403. Checked on 225 and changed thermostate for 101",
    "amount": 1340.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-104",
    "invoiceNumber": "J-000111",
    "customer": "Paradigmcos",
    "date": "2025-12-14",
    "serviceDescription": "Water Heater Replacement (APT 815  , PO# MG-13881)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13881",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-105",
    "invoiceNumber": "J-000112",
    "customer": "Townes at Herndon",
    "date": "2025-12-15",
    "serviceDescription": "Water Heater Replacement (Townhouse # 621L)",
    "amount": 2550.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-106",
    "invoiceNumber": "J-000113",
    "customer": "Paradigmcos",
    "date": "2025-12-16",
    "serviceDescription": "HVAC Replacement (APT 1329) – Condenser & Air Handling Unit PO#  MG-13881",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13881",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-107",
    "invoiceNumber": "J-000114",
    "customer": "Paradigmcos",
    "date": "2025-12-17",
    "serviceDescription": "HVAC Replacement (APT 535) – Condenser & Air Handling Unit PO#  MG-13881",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13881",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-108",
    "invoiceNumber": "J-000115",
    "customer": "Townes at Herndon",
    "date": "2025-12-20",
    "serviceDescription": "Water Heater Replacement (Townhouse # 571L)",
    "amount": 2550.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-109",
    "invoiceNumber": "J-000116",
    "customer": "Paradigmcos",
    "date": "2025-12-23",
    "serviceDescription": "Repipe Hot Loop for Air handler (Apt 206) PO# MG-13895",
    "amount": 549.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13895",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-110",
    "invoiceNumber": "J-000117",
    "customer": "Paradigmcos/ Ballston",
    "date": "2025-12-24",
    "serviceDescription": "Service Call: Replace Hydronic Coil for Apartment #712 PO:MB21921",
    "amount": 565.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MB21921",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": []
  },
  {
    "id": "imported-row-111",
    "invoiceNumber": "J-000118",
    "customer": "Alate Old Town",
    "date": "2025-12-28",
    "serviceDescription": "Emergency Call: Odor in garage floor going up to the first floor and water flooding the garage",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-112",
    "invoiceNumber": "J-000119",
    "customer": "Paradigmcos",
    "date": "2025-12-29",
    "serviceDescription": "Water Heater Replacement (APT 225  , PO# MG-13901)",
    "amount": 1125.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13901",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-113",
    "invoiceNumber": "J-000120",
    "customer": "Alate Old Town",
    "date": "2025-12-30",
    "serviceDescription": "Emergency Call: sewage water overflowing and flooding the garage; Bought hoses and coupling to add to pump and pump out water",
    "amount": 820.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-114",
    "invoiceNumber": "J-000121",
    "customer": "Paradigmcos",
    "date": "2026-01-05",
    "serviceDescription": "Water Heater Replacement (APT 1030  , PO# MG-13923)",
    "amount": 1185.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13923",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-115",
    "invoiceNumber": "J-000122",
    "customer": "The Clarendon Apartments",
    "date": "2026-01-06",
    "serviceDescription": "HVAC Replacement (APT 258) – Condenser & Air Handling Unit",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-116",
    "invoiceNumber": "J-000123",
    "customer": "Alate Old Town",
    "date": "2026-01-07",
    "serviceDescription": "Service Call: Diagnosed and changed thermostate for Apartment 208",
    "amount": 495.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Alate Old Town",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-117",
    "invoiceNumber": "J-000124",
    "customer": "Townes at Herndon",
    "date": "2026-01-09",
    "serviceDescription": "Water Heater Replacement (Townhouse # 700L)",
    "amount": 2550.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "Townes at Herndon",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-118",
    "invoiceNumber": "J-000125",
    "customer": "Paradigmcos",
    "date": "2026-01-10",
    "serviceDescription": "Water Heater Replacement (APT 223  , PO# MG-13932)",
    "amount": 1250.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13932",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-119",
    "invoiceNumber": "J-000126",
    "customer": "Paradigmcos",
    "date": "2026-01-14",
    "serviceDescription": "Furnance and Coil Replacement (Lobby  , PO# MG-13947)",
    "amount": 4000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13947",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-120",
    "invoiceNumber": "J-000127",
    "customer": "Paradigmcos",
    "date": "2026-01-30",
    "serviceDescription": "HVAC Replacement (APT 202) – Condenser & Air Handling Unit PO#  MG-13978",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13978",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-121",
    "invoiceNumber": "J-000128",
    "customer": "The Clarendon Apartments",
    "date": "2026-01-20",
    "serviceDescription": "Diagnose HVAC unit for APT 202; Hot Loop had issue. Wasnt receiving hot water in the supply; Changed pump at managers request",
    "amount": 1140.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-122",
    "invoiceNumber": "J-000129",
    "customer": "Paradigmcos",
    "date": "2026-01-20",
    "serviceDescription": "Water Heater Replacement (APT 1106  , PO# MG-13946)",
    "amount": 1250.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13946",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-123",
    "invoiceNumber": "J-000130",
    "customer": "The Clarendon Apartments",
    "date": "2026-01-21",
    "serviceDescription": "Replaced coil, circulation pump, and relays to HVAC unit for APT 202 at mangers request; Didn't resolve the issue",
    "amount": 1015.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-124",
    "invoiceNumber": "J-000131",
    "customer": "Paradigmcos",
    "date": "2026-01-21",
    "serviceDescription": "Water Heater Replacement (APT 402  , PO# MG-13979)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13979",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-125",
    "invoiceNumber": "J-000132",
    "customer": "Paradigmcos",
    "date": "2026-01-21",
    "serviceDescription": "HVAC Replacement (APT 1106 – Condenser & Air Handling Unit PO#  MG-13980",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13980",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-126",
    "invoiceNumber": "J-000133",
    "customer": "The Clarendon Apartments",
    "date": "2026-01-22",
    "serviceDescription": "Diagnosed unit after the plumber fixed the return and supply on the water heater because they were crossed over",
    "amount": 895.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-127",
    "invoiceNumber": "J-000134",
    "customer": "Paradigmcos",
    "date": "2026-01-22",
    "serviceDescription": "Water Heater Replacement (APT 219  , PO# MG-13946)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13946",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-128",
    "invoiceNumber": "J-000135",
    "customer": "Paradigmcos",
    "date": "2026-01-28",
    "serviceDescription": "Water Heater Replacement (APT 303  , PO# MG-13964 )",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13964",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-129",
    "invoiceNumber": "J-000136",
    "customer": "Paradigmcos",
    "date": "2026-01-28",
    "serviceDescription": "HVAC Replacement (APT 303 – Condenser & Air Handling Unit PO#  MG-13965",
    "amount": 6000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13965",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-130",
    "invoiceNumber": "J-000137",
    "customer": "The Clarendon Apartments",
    "date": "2026-01-29",
    "serviceDescription": "Diagnosed townhouse #3162 ; HVAC system needs to be replaced",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-131",
    "invoiceNumber": "J-000138",
    "customer": "Paradigmcos",
    "date": "2026-01-30",
    "serviceDescription": "Heater replacement in the composite room (PO# MG-13981)",
    "amount": 680.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13981",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-132",
    "invoiceNumber": "J-000139",
    "customer": "Paradigmcos",
    "date": "2026-01-30",
    "serviceDescription": "Tankless water heater replacement in the gym bathroom (PO# MG-13981)",
    "amount": 1438.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13981",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-133",
    "invoiceNumber": "J-000140",
    "customer": "The clarendon Apartments",
    "date": "2026-02-04",
    "serviceDescription": "Replace Hydronic Coil for Apartment 421; Mentioned to the service manager that the unit was wet all over the fan, relays, high voltage, low voltage wiring",
    "amount": 565.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-134",
    "invoiceNumber": "J-000141",
    "customer": "The Clarendon Apartments",
    "date": "2026-02-04",
    "serviceDescription": "Services call: Diagnose Apartment 363 ; the supply and return in the hot loop seem to be crossed",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-135",
    "invoiceNumber": "J-000142",
    "customer": "Paradigmcos",
    "date": "2026-02-04",
    "serviceDescription": "Water Heater Replacement (APT 125  , PO# MG-13991 )",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13991",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-136",
    "invoiceNumber": "J-000143",
    "customer": "Paradigmcos",
    "date": "2026-02-04",
    "serviceDescription": "Restock HVAC Equipment: 2x Air Handler and 2x condensors PO# MG-13990",
    "amount": 7870.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13990",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-137",
    "invoiceNumber": "J-000144",
    "customer": "The Clarendon Apartments",
    "date": "2026-02-06",
    "serviceDescription": "Services call: Diagnose Apartment 421; Unit is no good. The system will need to be replaced since it was flooded with water; relays burnt",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-138",
    "invoiceNumber": "J-000145",
    "customer": "The Clarendon Apartments",
    "date": "2026-02-06",
    "serviceDescription": "Services call: Diagnose Apartment 904; Thermostat reading the wrong temperature and not shutting off the unit in heatimg mode. \nWe replaced the thermostat as the old one was not calibrated anymore.",
    "amount": 395.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-139",
    "invoiceNumber": "J-000146",
    "customer": "The Clarendon Apartments",
    "date": "2026-02-09",
    "serviceDescription": "HVAC Replacement (Townhouse #3162) – Condenser & Air Handling Unit ; Heat Pump",
    "amount": 6400.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-140",
    "invoiceNumber": "J-000147",
    "customer": "The Clarendon Apartments",
    "date": "2026-02-13",
    "serviceDescription": "HVAC Replacement (Apt 421) – Condenser & Air Handling Unit",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-141",
    "invoiceNumber": "J-000148",
    "customer": "Paradigmcos",
    "date": "2026-02-18",
    "serviceDescription": "Water Heater Replacement (APT 1128 , PO# MG-13643 )",
    "amount": 1385.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13643",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-142",
    "invoiceNumber": "J-000149",
    "customer": "Paradigmcos",
    "date": "2026-02-24",
    "serviceDescription": "HVAC Replacement (APT 112 – Condenser & Air Handling Unit PO#  MG-13666",
    "amount": 2065.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13666",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-143",
    "invoiceNumber": "J-000150",
    "customer": "Paradigmcos",
    "date": "2026-02-24",
    "serviceDescription": "Gas Leak repair in (APT 112, PO# MG-13666",
    "amount": 595.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13666",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-144",
    "invoiceNumber": "J-000151",
    "customer": "Paradigmcos",
    "date": "2026-02-25",
    "serviceDescription": "Water Heater Replacement (APT 1021, PO#  MG-13666)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13666",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-145",
    "invoiceNumber": "J-000152",
    "customer": "Paradigmcos",
    "date": "2026-03-04",
    "serviceDescription": "Water Heater Replacement (APT 931, PO#  MG-13706)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13706",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-146",
    "invoiceNumber": "J-000153",
    "customer": "Paradigmcos",
    "date": "2026-03-06",
    "serviceDescription": "Water Heater Replacement (APT 733, PO#  MG-13706)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13706",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-147",
    "invoiceNumber": "J-000154",
    "customer": "Paradigmcos",
    "date": "2026-03-06",
    "serviceDescription": "Water Heater Replacement (APT 831, PO#  MG-13706)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13706",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-148",
    "invoiceNumber": "J-000155",
    "customer": "Paradigmcos",
    "date": "2026-03-11",
    "serviceDescription": "HVAC Replacement (APT 920 – Condenser & Air Handling Unit PO#  MG-13727.      NOTES: Had to move water heater to replace condensor",
    "amount": 3015.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13727",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-149",
    "invoiceNumber": "J-000156",
    "customer": "Paradigmcos",
    "date": "2026-03-11",
    "serviceDescription": "Condenstaion drain repair in Apartment 313 & 213 PO# MG-13726",
    "amount": 1250.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13726",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-150",
    "invoiceNumber": "J-000157",
    "customer": "Paradigmcos",
    "date": "2026-03-13",
    "serviceDescription": "Water Heater Replacement (APT 323 , PO#  MG-13727)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13727",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-151",
    "invoiceNumber": "J-000158",
    "customer": "The Clarendon Apartments",
    "date": "2026-03-13",
    "serviceDescription": "HVAC Replacement (Apt 438) – Condenser & Air Handling Unit",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-152",
    "invoiceNumber": "J-000159",
    "customer": "`Paradigmcos",
    "date": "2026-03-12",
    "serviceDescription": "Restock HVAC Equipment: 2x Air Handler and 2x condensors PO# MG- 13742",
    "amount": 7870.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13742",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-153",
    "invoiceNumber": "J-000160",
    "customer": "Paradigmcos",
    "date": "2026-03-17",
    "serviceDescription": "Leak Repair in condensation drain for Apartment 124 & 424 PO# MG- 13743",
    "amount": 950.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13743",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-154",
    "invoiceNumber": "J-000161",
    "customer": "Paradigmcos",
    "date": "2026-03-24",
    "serviceDescription": "Water Heater Replacement (APT 525, PO#  MG-13746)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13746",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-155",
    "invoiceNumber": "J-000162",
    "customer": "Paradigmcos",
    "date": "2026-03-24",
    "serviceDescription": "Restock HVAC Equipment: 2x Air Handler and 2x condensors PO# MG- 13747",
    "amount": 7870.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13747",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-156",
    "invoiceNumber": "J-000163",
    "customer": "The Clarendon Apartments",
    "date": "2026-03-25",
    "serviceDescription": "HVAC Replacement (Apt 456 ) – 3-TON Condenser & Air Handling Unit",
    "amount": 6050.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-157",
    "invoiceNumber": "J-000164",
    "customer": "Paradigmcos",
    "date": "2026-03-30",
    "serviceDescription": "HVAC Replacement (Gym Area – Condenser & Air Handling Unit PO#  MG- 13760",
    "amount": 8537.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13760",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-158",
    "invoiceNumber": "J-000165",
    "customer": "Paradigmcos",
    "date": "2026-04-02",
    "serviceDescription": "Drain Leak in APT 201 (Main Drain line) and APT 615 (Air handler drain) PO# MG- 13767",
    "amount": 950.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13767",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-159",
    "invoiceNumber": "J-000166",
    "customer": "Paradigmcos/ Ballston",
    "date": "2026-04-03",
    "serviceDescription": "Service Call: Replace Hydronic Coil for Apartment #401 PO:MB22076",
    "amount": 565.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MB22076",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": []
  },
  {
    "id": "imported-row-160",
    "invoiceNumber": "J-000167",
    "customer": "Paradigmcos",
    "date": "2026-04-03",
    "serviceDescription": "HVAC Replacement (APT 1424 – Condenser & Air Handling Unit PO#  MG- 13774",
    "amount": 2065.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13774",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-161",
    "invoiceNumber": "J-000168",
    "customer": "Paradigmcos",
    "date": "2026-04-08",
    "serviceDescription": "HVAC Replacement (APT 613 – Condenser & Air Handling Unit PO#  MG- 13782",
    "amount": 2065.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13782",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-162",
    "invoiceNumber": "J-000169",
    "customer": "The Clarendon Apartments",
    "date": "2026-04-09",
    "serviceDescription": "Service Call: Electrical Issue in Apartment 516",
    "amount": 490.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-163",
    "invoiceNumber": "J-000170",
    "customer": "Paradigmcos",
    "date": "2026-04-10",
    "serviceDescription": "Water Heater Replacement (APT 1119, PO#  MG-13786)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13786",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-164",
    "invoiceNumber": "J-000171",
    "customer": "Paradigmcos",
    "date": "2026-04-10",
    "serviceDescription": "Water Heater Replacement (APT 324, PO#  MG-13788) (Main Drain Leak Repair)",
    "amount": 1835.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13788",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-165",
    "invoiceNumber": "J-000172",
    "customer": "Paradigmcos",
    "date": "2026-04-11",
    "serviceDescription": "Water Heater Replacement (APT 1415, PO#  MG-13788)",
    "amount": 1050.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13788",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-166",
    "invoiceNumber": "J-000173",
    "customer": "Paradigmcos",
    "date": "2026-04-13",
    "serviceDescription": "Water Heater Replacement (APT 804, PO#  MG-13791) (Provided shut-off valves and Fixed Main Drain Leak)",
    "amount": 1970.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13791",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-167",
    "invoiceNumber": "J-000174",
    "customer": "Paradigmcos",
    "date": "2026-04-15",
    "serviceDescription": "Water Heater Replacement (APT 116, PO#  MG-13778) (Shut-off Valves)",
    "amount": 1185.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13778",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-168",
    "invoiceNumber": "J-000175",
    "customer": "Paradigmcos",
    "date": "2026-04-15",
    "serviceDescription": "HVAC Replacement (APT 1134 – Condenser & Air Handling Unit PO#  MG-13801 (Electrical outlet issue where the condensor plugs in)",
    "amount": 2585.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13801",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-169",
    "invoiceNumber": "J-000176",
    "customer": "Paradigmcos",
    "date": "2026-04-15",
    "serviceDescription": "HVAC Replacement (APT 1015 – Condenser & Air Handling Unit PO#  MG-13802",
    "amount": 2000.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13802",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-170",
    "invoiceNumber": "J-000177",
    "customer": "Paradigmcos/ Ballston",
    "date": "2026-04-16",
    "serviceDescription": "HVAC Replacement (APT 1207 – Condenser & Air Handling Unit PO#  MB22098",
    "amount": 3100.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MB22098",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": [
      "Needs payment status"
    ]
  },
  {
    "id": "imported-row-171",
    "invoiceNumber": "J-000178",
    "customer": "The Clarendon Apartments",
    "date": "2026-04-22",
    "serviceDescription": "HVAC Replacement (Apt 516 ) – 3-TON Condenser & Air Handling Unit (Added R32 Refrigerant)",
    "amount": 0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-172",
    "invoiceNumber": "J-000179",
    "customer": "The Clarendon Apartments",
    "date": "2026-04-23",
    "serviceDescription": "HVAC Replacement (Apt 447 ) – 2-TON Condenser & Air Handling Unit",
    "amount": 0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-173",
    "invoiceNumber": "J-000180",
    "customer": "The Clarendon Apartments",
    "date": "2026-04-24",
    "serviceDescription": "HVAC Replacement (Apt 301 ) – 3-TON Condenser & Air Handling Unit (Added R32 refrigerant)",
    "amount": 0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-174",
    "invoiceNumber": "J-000181",
    "customer": "Paradigmcos",
    "date": "2026-04-24",
    "serviceDescription": "Water Heater Replacement (APT 311, PO#  MG-13812) (Shut-off Valves)",
    "amount": 1185.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13812",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-175",
    "invoiceNumber": "J-000182",
    "customer": "Paradigmcos",
    "date": "2026-04-24",
    "serviceDescription": "Restock HVAC Equipment: 3x Air Handler and 3x condensors PO# MG-13809",
    "amount": 11805.0,
    "paidText": "Paid",
    "status": "Paid",
    "poNumber": "MG-13809",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-176",
    "invoiceNumber": "J-000183",
    "customer": "Paradigmcos",
    "date": "2026-04-27",
    "serviceDescription": "HVAC Replacement (APT 211 – Condenser & Air Handling Unit PO#  MG-13813",
    "amount": 2000.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13813",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-177",
    "invoiceNumber": "J-000184",
    "customer": "Paradigmcos",
    "date": "2026-04-28",
    "serviceDescription": "HVAC Replacement (APT 403 – Condenser & Air Handling Unit PO#  MG-13815",
    "amount": 2000.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13815",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-178",
    "invoiceNumber": "J-000185",
    "customer": "Paradigmcos",
    "date": "2026-05-05",
    "serviceDescription": "Water Heater Replacement (APT 320, PO#  MG-13839) (Pickup and Delivery Fee)",
    "amount": 1250.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13839",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-179",
    "invoiceNumber": "J-000186",
    "customer": "The Clarendon Apartments",
    "date": "2026-05-06",
    "serviceDescription": "Service Call: Low voltage(24 volts) bad wiring in Apartment 904",
    "amount": 485.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-180",
    "invoiceNumber": "J-000187",
    "customer": "Paradigmcos",
    "date": "2026-05-16",
    "serviceDescription": "Restock HVAC Equipment: 2x Air Handler and 2x condensors PO# MG- 13838",
    "amount": 7870.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13838",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-181",
    "invoiceNumber": "J-000188",
    "customer": "Paradigmcos",
    "date": "2026-05-21",
    "serviceDescription": "Water Heater Replacement (APT 1116, PO#  MG-13863) (Pickup and Delivery Fee)",
    "amount": 1250.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13863",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-182",
    "invoiceNumber": "J-000189",
    "customer": "The Clarendon Apartments",
    "date": "2026-05-22",
    "serviceDescription": "Service Call: Dirty coils for both condensors in Townhouse # 3162",
    "amount": 0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-183",
    "invoiceNumber": "J-000190",
    "customer": "Paradigmcos",
    "date": "2026-05-23",
    "serviceDescription": "Parts: Provided Compresssor for Lobby Goodman Condensor PO# MG-13872",
    "amount": 1265.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13872",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-184",
    "invoiceNumber": "J-000191",
    "customer": "Paradigmcos",
    "date": "2026-05-23",
    "serviceDescription": "HVAC Replacement (APT1318 – Condenser & Air Handling Unit PO#  MG-13865",
    "amount": 2000.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-13865",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-185",
    "invoiceNumber": "J-000192",
    "customer": "Paradigmcos",
    "date": "2026-05-27",
    "serviceDescription": "Drain Leak in APT 913 (Main Drain line) and (Air handler drain) PO# MG- 14019",
    "amount": 785.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-14019",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-186",
    "invoiceNumber": "J-000193",
    "customer": "Paradigmcos",
    "date": "2026-05-28",
    "serviceDescription": "Water Heater Replacement (APT 326, PO#  MG-14016) (Pickup and Delivery Fee)",
    "amount": 1250.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-14016",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-187",
    "invoiceNumber": "J-000194",
    "customer": "Paradigmcos/ Ballston",
    "date": "2026-05-29",
    "serviceDescription": "Service Call: Replace Hydronic Coil for Apartment #709 PO:MB22180",
    "amount": 565.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MB22180",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": [
      "Needs payment status"
    ]
  },
  {
    "id": "imported-row-188",
    "invoiceNumber": "J-000195",
    "customer": "Paradigmcos",
    "date": "2026-06-01",
    "serviceDescription": "HVAC Replacement (APT814 – Condenser & Air Handling Unit PO#  MG-14020.  HAD TO MOVE WATER HEATER TO REPLACE CONDENSOR",
    "amount": 2950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-14020",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-189",
    "invoiceNumber": "J-000196",
    "customer": "Paradigmcos",
    "date": "2026-06-01",
    "serviceDescription": "Parts: Provide Condensor Fan Blades x4 PO# MG-14021 $100 delivery fee",
    "amount": 628.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MG-14021",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match"
    ]
  },
  {
    "id": "imported-row-190",
    "invoiceNumber": "J-000197",
    "customer": "The Clarendon Apartments",
    "date": "2026-06-03",
    "serviceDescription": "HVAC Replacement (Apt 354 ) – 2-TON Condenser & Air Handling Unit ()",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-191",
    "invoiceNumber": "J-000198",
    "customer": "Paradigmcos",
    "date": "2026-06-03",
    "serviceDescription": "HVAC Replacement (APT 125 – Condenser & Air Handling Unit PO#  MG-",
    "amount": 2000.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-192",
    "invoiceNumber": "J-000199",
    "customer": "The Clarendon Apartments",
    "date": "2026-06-05",
    "serviceDescription": "HVAC Replacement (Apt 350 ) – 2-TON Condenser & Air Handling Unit ()",
    "amount": 5950.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Needs mapping",
    "propertyName": "The Clarendon Apartments",
    "cleanupFlags": [
      "Needs payment status",
      "Needs PO"
    ]
  },
  {
    "id": "imported-row-193",
    "invoiceNumber": "J-000200",
    "customer": "Paradigmcos/ Ballston",
    "date": "2026-06-05",
    "serviceDescription": "HVAC Replacement (APT 511 – Condenser & Air Handling Unit PO#  MB22184",
    "amount": 3100.0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "MB22184",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Meridian at Ballston Commons",
    "cleanupFlags": [
      "Needs payment status"
    ]
  },
  {
    "id": "imported-row-194",
    "invoiceNumber": "J-000201",
    "customer": "Paradigmcos",
    "date": "2026-06-05",
    "serviceDescription": "HVAC Replacement (APT1013 – Condenser & Air Handling Unit PO#  MG-        Bought the units, Emergency Fee of $300",
    "amount": 0,
    "paidText": "",
    "status": "Needs Cleanup",
    "poNumber": "Needs cleanup",
    "source": "Imported tracker",
    "managementCompany": "Paradigm Companies",
    "propertyName": "Needs property match",
    "cleanupFlags": [
      "Needs payment status",
      "Needs property match",
      "Needs PO"
    ]
  }
];

export const importedInvoiceRowSummary = {
  source: "Full_Invoice_Tracker_AutoFit.xlsx",
  invoiceCount: 194,
  totalRevenue: 384486.96,
  paidRevenue: 222727.96,
  unpaidOrNeedsCleanup: 161759.0
};
