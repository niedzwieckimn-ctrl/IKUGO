// Prepared editorial examples from the approved NOVA-01–NOVA-66 catalog. Fictional USD amounts, not currency conversions. No live data.
window.IKUGO_LIBRARY = {
  "snapshot": "12 October 2026",
  "categories": [
    {
      "id": "inventory",
      "label": "Inventory & availability",
      "description": "Stock, reservations and replenishment",
      "count": 10
    },
    {
      "id": "counting",
      "label": "Stock counts & adjustments",
      "description": "Observe, reconcile and confirm",
      "count": 10
    },
    {
      "id": "orders",
      "label": "Customer orders",
      "description": "From order details to dispatch",
      "count": 14
    },
    {
      "id": "sales",
      "label": "Sales & statistics",
      "description": "Figures with a clear basis",
      "count": 8
    },
    {
      "id": "inbound",
      "label": "Import & inbound",
      "description": "Purchase orders and incoming goods",
      "count": 8
    },
    {
      "id": "finance",
      "label": "Invoices & payments",
      "description": "Documents, due dates and approvals",
      "count": 10
    },
    {
      "id": "customers",
      "label": "Customers & partners",
      "description": "Find the right business context",
      "count": 6
    }
  ],
  "scenarios": [
    {
      "id": "NOVA-01",
      "category": "inventory",
      "title": "Physical stock",
      "question": "How many PB-20000 powerbanks are physically in stock?",
      "answer": "There are 2 units of PB-20000 in the warehouse.",
      "type": "read",
      "note": "Physical stock and availability after reservations are different measures.",
      "view": {
        "kind": "metrics",
        "title": "PB-20000",
        "items": [
          {
            "label": "Physical stock",
            "value": "2",
            "detail": "units"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-03",
        "NOVA-09"
      ],
      "keywords": "warehouse on hand stock powerbank powerbank battery"
    },
    {
      "id": "NOVA-02",
      "category": "inventory",
      "title": "Available to sell",
      "question": "How many USB-C-60 chargers can I still offer a customer?",
      "answer": "18 units are available: 30 in stock, with 12 reserved.",
      "type": "read",
      "note": "Availability uses the existing reservation calculation.",
      "view": {
        "kind": "metrics",
        "title": "USB-C-60 availability",
        "items": [
          {
            "label": "On hand",
            "value": "30",
            "detail": "units"
          },
          {
            "label": "Reserved",
            "value": "12",
            "detail": "units"
          },
          {
            "label": "Available",
            "value": "18",
            "detail": "units"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-03",
      "category": "inventory",
      "title": "Why availability is zero",
      "question": "Why is PB-20000 unavailable when we have 2 in stock?",
      "answer": "Active orders reserve 40 units. With 2 on hand, there is no unreserved stock for another customer.",
      "type": "analysis",
      "note": "A physical stock figure alone does not tell you what is available to sell.",
      "view": {
        "kind": "metrics",
        "title": "Committed stock",
        "items": [
          {
            "label": "On hand",
            "value": "2",
            "detail": ""
          },
          {
            "label": "Reserved",
            "value": "40",
            "detail": ""
          },
          {
            "label": "Available",
            "value": "0",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-09",
        "NOVA-47"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-04",
      "category": "inventory",
      "title": "Resolve a product variant",
      "question": "Check the USB-C charger.",
      "answer": "I found USB-C-60 and USB-C-100. Which variant do you mean?",
      "type": "read",
      "note": "An ambiguous product needs clarification before the agent continues.",
      "view": {
        "kind": "table",
        "title": "Two matching products",
        "columns": [
          "Product",
          "Variant"
        ],
        "rows": [
          [
            "USB-C-60",
            "60 W charger"
          ],
          [
            "USB-C-100",
            "100 W charger"
          ]
        ],
        "foot": "Illustrative choices. No variant is selected automatically."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-05",
      "category": "inventory",
      "title": "Inventory overview",
      "question": "How many products and units do we have in total?",
      "answer": "NOVA has 248 active products and 1,840 units of physical stock.",
      "type": "read",
      "note": "Product count and unit count describe different things.",
      "view": {
        "kind": "metrics",
        "title": "NOVA inventory",
        "items": [
          {
            "label": "Active products",
            "value": "248",
            "detail": ""
          },
          {
            "label": "Units on hand",
            "value": "1,840",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-06",
      "category": "inventory",
      "title": "Dashboard inventory value",
      "question": "What inventory value does the dashboard show?",
      "answer": "The dashboard shows USD 246,800 net. This measure includes stock and confirmed incoming goods, valued using the price list.",
      "type": "analysis",
      "note": "Requires operational summaries and dashboard permissions. This is not the purchase cost of goods on the shelf.",
      "view": {
        "kind": "metrics",
        "title": "Dashboard measure",
        "items": [
          {
            "label": "Inventory value",
            "value": "246,800",
            "detail": "USD · net"
          }
        ],
        "foot": "On-hand stock + confirmed incoming goods, at price-list values."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-07",
      "category": "inventory",
      "title": "Restocking priorities",
      "question": "What should we restock now?",
      "answer": "The leading recommendations are C400: 40 units, X200: 40 units and PB-20000: 18 units, from IKUGO’s replenishment calculation.",
      "type": "analysis",
      "note": "A suggested purchase quantity is different from an order shortage. No supplier order is placed.",
      "view": {
        "kind": "ranking",
        "title": "Suggested purchase quantities",
        "items": [
          {
            "label": "C400",
            "value": 40
          },
          {
            "label": "X200",
            "value": 40
          },
          {
            "label": "PB-20000",
            "value": 18
          }
        ],
        "unit": "units",
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-09"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-08",
      "category": "inventory",
      "title": "No available stock",
      "question": "Show products with no stock available to customers.",
      "answer": "PB-20000, C400 and X200 have no available stock. Zero availability does not always mean zero physical stock.",
      "type": "read",
      "note": "Requires the enabled structured reporting capability and owner permissions. These are examples from the matching results.",
      "view": {
        "kind": "table",
        "title": "Availability after reservations",
        "columns": [
          "SKU",
          "Available"
        ],
        "rows": [
          [
            "PB-20000",
            "0 units"
          ],
          [
            "C400",
            "0 units"
          ],
          [
            "X200",
            "0 units"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-09",
      "category": "inventory",
      "title": "Incoming shortage coverage",
      "question": "Will incoming deliveries cover the powerbank orders?",
      "answer": "PB-20000 is short by 38 units against physical stock. The confirmed 60 incoming units cover that shortage, leaving 22 beyond current demand.",
      "type": "analysis",
      "note": "Requires operational summaries. Coverage is calculated once per product across orders; it does not create allocations.",
      "view": {
        "kind": "metrics",
        "title": "PB-20000 demand coverage",
        "items": [
          {
            "label": "Shortage",
            "value": "38",
            "detail": "units"
          },
          {
            "label": "Confirmed incoming",
            "value": "60",
            "detail": "units"
          },
          {
            "label": "Uncovered",
            "value": "0",
            "detail": "units"
          }
        ],
        "foot": "22 incoming units remain beyond current demand."
      },
      "steps": [],
      "related": [
        "NOVA-47"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-10",
      "category": "inventory",
      "title": "Today’s priorities",
      "question": "What needs my attention today?",
      "answer": "24 orders are stock-ready. Review 3 overdue invoices, uncovered C400 and X200 shortages, and 6 inbound deliveries with alerts.",
      "type": "analysis",
      "note": "Requires operational summaries and relevant permissions. “Today” is 12 October 2026 in this example; stock readiness is not shipping completion.",
      "view": {
        "kind": "table",
        "title": "Operational priorities",
        "columns": [
          "Area",
          "Recorded situation"
        ],
        "rows": [
          [
            "Orders",
            "24 stock-ready"
          ],
          [
            "Payments",
            "3 overdue invoices"
          ],
          [
            "Stock",
            "C400 and X200 shortages"
          ],
          [
            "Inbound",
            "6 deliveries with alerts"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-23",
        "NOVA-49",
        "NOVA-51"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-11",
      "category": "counting",
      "title": "Start a stock count",
      "question": "Start an inventory counting session.",
      "answer": "The counting session is open. Give me the product and the quantity you counted.",
      "type": "write",
      "note": "An existing open session is reused. A draft annual stocktake must first be started on the inventory screen.",
      "view": {
        "kind": "facts",
        "title": "Counting session",
        "items": [
          {
            "label": "Status",
            "value": "Open"
          },
          {
            "label": "Next input",
            "value": "Product + counted quantity"
          },
          {
            "label": "Stock changed",
            "value": "No"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-12",
        "NOVA-13"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-12",
      "category": "counting",
      "title": "Record a matching count",
      "question": "I counted 20 units of USB-C-100.",
      "answer": "Recorded: 20 USB-C-100 units. The system also shows 20 — no difference.",
      "type": "write",
      "note": "An open counting session and an unambiguous product are required. Recording a count does not change stock.",
      "view": {
        "kind": "metrics",
        "title": "Count observation",
        "items": [
          {
            "label": "System",
            "value": "20",
            "detail": ""
          },
          {
            "label": "Counted",
            "value": "20",
            "detail": ""
          },
          {
            "label": "Difference",
            "value": "0",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-13",
      "category": "counting",
      "title": "Record a discrepancy",
      "question": "There are 28 USB-C-60 units on the shelf.",
      "answer": "Recorded: 28. The system shows 30, a difference of −2 units. Shall I prepare an adjustment?",
      "type": "write",
      "note": "This asks whether to prepare an adjustment. No stock adjustment has been executed; system stock remains 30.",
      "view": {
        "kind": "metrics",
        "title": "Count observation",
        "items": [
          {
            "label": "System",
            "value": "30",
            "detail": ""
          },
          {
            "label": "Counted",
            "value": "28",
            "detail": ""
          },
          {
            "label": "Difference",
            "value": "−2",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-14",
        "NOVA-15",
        "NOVA-16"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-14",
      "category": "counting",
      "title": "Approve a stock adjustment",
      "question": "Prepare an adjustment of USB-C-60 to the counted 28 units.",
      "answer": "The adjustment is awaiting approval: USB-C-60, from 30 to 28 units, a difference of −2. Do you approve?",
      "type": "approval",
      "note": "Requires a recorded count, an authorised human decision and a fresh version check. A pending adjustment has not changed stock.",
      "view": {
        "kind": "change",
        "title": "Proposed stock adjustment",
        "before": "30 units",
        "after": "28 units",
        "label": "USB-C-60",
        "foot": "Difference: −2 units."
      },
      "steps": [
        "Yes, I approve this adjustment.",
        "USB-C-60 stock has been set to 28 units. Adjustment: −2."
      ],
      "related": [
        "NOVA-13"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-15",
      "category": "counting",
      "title": "Correct a count",
      "question": "I recounted USB-C-60: there are 29, not 28.",
      "answer": "The current count is 29. System stock is still 30, a difference of −1. The earlier count stays in the history; no adjustment has been made.",
      "type": "write",
      "note": "An alternative after recording 28, before any stock adjustment. Recounting supersedes the observation and invalidates its earlier approval.",
      "view": {
        "kind": "table",
        "title": "Count history",
        "columns": [
          "Observation",
          "Quantity",
          "State"
        ],
        "rows": [
          [
            "First count",
            "28",
            "Superseded"
          ],
          [
            "Recount",
            "29",
            "Current"
          ],
          [
            "System stock",
            "30",
            "Unchanged"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-16",
      "category": "counting",
      "title": "Keep a count without adjusting",
      "question": "Keep the USB-C-60 count of 28, but do not change stock.",
      "answer": "The count of 28 is retained without a stock adjustment. System stock remains 30.",
      "type": "write",
      "note": "An explicit count-only decision withdraws the pending adjustment for this product, while retaining the observation.",
      "view": {
        "kind": "facts",
        "title": "Count-only record",
        "items": [
          {
            "label": "Counted quantity",
            "value": "28"
          },
          {
            "label": "System stock",
            "value": "30"
          },
          {
            "label": "Outcome",
            "value": "Observation retained"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-17",
      "category": "counting",
      "title": "Pause and resume",
      "question": "Pause the count. I will be back after a break.",
      "answer": "Counting is paused. The recorded results remain in the session.",
      "type": "write",
      "note": "Pausing stops active-time measurement. It does not close an annual inventory document.",
      "view": {
        "kind": "facts",
        "title": "Counting activity",
        "items": [
          {
            "label": "Status",
            "value": "Paused"
          },
          {
            "label": "Recorded results",
            "value": "Retained"
          },
          {
            "label": "Annual document",
            "value": "Not closed"
          }
        ],
        "foot": ""
      },
      "steps": [
        "Resume counting.",
        "Counting has resumed. You can give me the next product."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-18",
      "category": "counting",
      "title": "Count progress",
      "question": "Summarise the current count.",
      "answer": "18 products counted: 15 matching, 1 adjusted and 2 with unresolved differences.",
      "type": "analysis",
      "note": "This is a separate moment in a session. Summary totals cover the session even if the item list is paginated.",
      "view": {
        "kind": "metrics",
        "title": "Session progress",
        "items": [
          {
            "label": "Matching",
            "value": "15",
            "detail": ""
          },
          {
            "label": "Adjusted",
            "value": "1",
            "detail": ""
          },
          {
            "label": "Unresolved",
            "value": "2",
            "detail": ""
          }
        ],
        "foot": "18 products counted in total."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-19",
      "category": "counting",
      "title": "Recount history",
      "question": "Show the USB-C-60 counting history for this session.",
      "answer": "First count: 28 units. Recount: 29 units. The second is current; the first remains in the history.",
      "type": "read",
      "note": "History can span several pages. The agent must not treat the first page as the entire history.",
      "view": {
        "kind": "table",
        "title": "USB-C-60 observations",
        "columns": [
          "Sequence",
          "Count",
          "Record"
        ],
        "rows": [
          [
            "01",
            "28",
            "Earlier observation"
          ],
          [
            "02",
            "29",
            "Current observation"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-20",
      "category": "counting",
      "title": "Finish a counting session",
      "question": "Finish the current counting session.",
      "answer": "The session is complete. There are no unresolved discrepancies or pending adjustments.",
      "type": "write",
      "note": "Applies to an ordinary counting session. A full annual stocktake must be closed on its screen; unresolved discrepancies block completion.",
      "view": {
        "kind": "facts",
        "title": "Session completed",
        "items": [
          {
            "label": "Unresolved differences",
            "value": "0"
          },
          {
            "label": "Pending adjustments",
            "value": "0"
          },
          {
            "label": "Status",
            "value": "Complete"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-21",
      "category": "orders",
      "title": "Orders for a customer",
      "question": "Show Orbit Electronics orders from the last 30 days.",
      "answer": "Orbit Electronics has 4 orders: NOVA-034, 035, 036 and 037. The latest is NOVA-037, placed on 12 October.",
      "type": "read",
      "note": "The customer is resolved before searching. A limited result is not treated as the entire history.",
      "view": {
        "kind": "table",
        "title": "Orbit Electronics · last 30 days",
        "columns": [
          "Order",
          "Context"
        ],
        "rows": [
          [
            "NOVA-034",
            "Matching order"
          ],
          [
            "NOVA-035",
            "Matching order"
          ],
          [
            "NOVA-036",
            "Matching order"
          ],
          [
            "NOVA-037",
            "Latest · 12 Oct 2026"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-22",
        "NOVA-65"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-22",
      "category": "orders",
      "title": "Order contents",
      "question": "What is in order NOVA-037?",
      "answer": "10 USB-C-60 chargers and 20 USB-C-100 chargers — 30 units in total. Status: new.",
      "type": "read",
      "note": "This example shows the order before packing or later amendments.",
      "view": {
        "kind": "table",
        "title": "NOVA-037 · new",
        "columns": [
          "Product",
          "Quantity"
        ],
        "rows": [
          [
            "USB-C-60",
            "10"
          ],
          [
            "USB-C-100",
            "20"
          ]
        ],
        "foot": "Total: 30 units."
      },
      "steps": [],
      "related": [
        "NOVA-25",
        "NOVA-29"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-23",
      "category": "orders",
      "title": "Ready for packing",
      "question": "Which orders can I complete from stock today?",
      "answer": "24 of 37 orders have stock coverage; 13 have shortages. NOVA-037 is stock-ready.",
      "type": "analysis",
      "note": "Uses the complete readiness result. This checks stock, not payment, paperwork or courier collection.",
      "view": {
        "kind": "metrics",
        "title": "Order readiness",
        "items": [
          {
            "label": "Stock-ready",
            "value": "24",
            "detail": ""
          },
          {
            "label": "With shortages",
            "value": "13",
            "detail": ""
          },
          {
            "label": "Orders checked",
            "value": "37",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-24",
        "NOVA-25"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-24",
      "category": "orders",
      "title": "Explain an order shortage",
      "question": "What is missing from NOVA-032?",
      "answer": "NOVA-032 needs 40 PB-20000 powerbanks. 2 units are available to this order; 38 are missing.",
      "type": "analysis",
      "note": "This case contains the full current demand of 40 PB-20000 units. The same stock is not assigned to other orders again.",
      "view": {
        "kind": "metrics",
        "title": "NOVA-032 · PB-20000",
        "items": [
          {
            "label": "Required",
            "value": "40",
            "detail": ""
          },
          {
            "label": "Available",
            "value": "2",
            "detail": ""
          },
          {
            "label": "Shortage",
            "value": "38",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-47"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-25",
      "category": "orders",
      "title": "Confirm physical packing",
      "question": "I packed every item in NOVA-037. Mark it as packed.",
      "answer": "The order is complete. Changing NOVA-037 to “packed” is awaiting approval. Do you confirm?",
      "type": "approval",
      "note": "The person confirms the physical work. Completeness, permissions and the current order version are checked again.",
      "view": {
        "kind": "change",
        "title": "Proposed order status",
        "before": "New",
        "after": "Packed",
        "label": "NOVA-037",
        "foot": "Physical packing is confirmed by the person, not inferred by AI."
      },
      "steps": [
        "Yes, I confirm.",
        "NOVA-037 is marked as packed. Stock has not been deducted again."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-26",
      "category": "orders",
      "title": "One shared packing list",
      "question": "Prepare one packing list for Orbit Electronics orders NOVA-035 and NOVA-036.",
      "answer": "The shared list contains 12 HDMI-2M units from NOVA-035 and 8 from NOVA-036 — 20 units in total. Creation is awaiting approval.",
      "type": "approval",
      "note": "The exact orders, SKUs and quantities are reviewed together. Creating a list does not confirm physical packing or dispatch.",
      "view": {
        "kind": "table",
        "title": "Proposed packing scope",
        "columns": [
          "Order",
          "SKU",
          "Units"
        ],
        "rows": [
          [
            "NOVA-035",
            "HDMI-2M",
            "12"
          ],
          [
            "NOVA-036",
            "HDMI-2M",
            "8"
          ]
        ],
        "foot": "One customer · 2 orders · 20 units."
      },
      "steps": [
        "I approve the list for these two orders.",
        "One packing list has been created for NOVA-035 and NOVA-036, containing 20 units."
      ],
      "related": [
        "NOVA-27"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-27",
      "category": "orders",
      "title": "Read the full packing list",
      "question": "What is on Orbit Electronics’ current shared packing list?",
      "answer": "NOVA-035 contributes 12 HDMI-2M units and NOVA-036 contributes 8. Total: 20 units, with no confirmed dispatch yet.",
      "type": "read",
      "note": "Reads saved allocations across all linked orders, not the items of just one order.",
      "view": {
        "kind": "table",
        "title": "Current packing list",
        "columns": [
          "Source order",
          "SKU",
          "Packed quantity"
        ],
        "rows": [
          [
            "NOVA-035",
            "HDMI-2M",
            "12"
          ],
          [
            "NOVA-036",
            "HDMI-2M",
            "8"
          ]
        ],
        "foot": "Prepared contents · dispatch not confirmed."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-28",
      "category": "orders",
      "title": "Last confirmed dispatch",
      "question": "What did we last ship to Orbit Electronics?",
      "answer": "The last confirmed dispatch was on 9 October: 20 USB-C-60 units and 10 USB-C-100 units, 30 in total.",
      "type": "read",
      "note": "Uses the dispatch event and linked invoices; the final packing list checks consistency. Missing evidence must be stated.",
      "view": {
        "kind": "table",
        "title": "Confirmed dispatch · 9 Oct 2026",
        "columns": [
          "Product",
          "Units"
        ],
        "rows": [
          [
            "USB-C-60",
            "20"
          ],
          [
            "USB-C-100",
            "10"
          ]
        ],
        "foot": "Total: 30 units."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-29",
      "category": "orders",
      "title": "Add to an order",
      "question": "Add 5 more USB-C-60 units to NOVA-037.",
      "answer": "Adding 5 USB-C-60 units is awaiting approval. The order will then contain 15 units of this product. Do you approve?",
      "type": "approval",
      "note": "This case is an editable order before documents are issued. Existing documents may require recreation; an invoice can block editing.",
      "view": {
        "kind": "change",
        "title": "Proposed order amendment",
        "before": "10 units",
        "after": "15 units",
        "label": "USB-C-60 · NOVA-037",
        "foot": "Adds a 5-unit line. 15 is the total for this SKU, not a promise to merge lines."
      },
      "steps": [
        "Yes, add 5 units.",
        "Added 5 USB-C-60 units. NOVA-037 now contains 15 units of this product."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-30",
      "category": "orders",
      "title": "Confirm an order",
      "question": "Change NOVA-037 from new to confirmed.",
      "answer": "The status change for NOVA-037, from “new” to “confirmed”, is awaiting approval.",
      "type": "approval",
      "note": "A separate case from the packing examples. Requires status-change permission and the current order version.",
      "view": {
        "kind": "change",
        "title": "Proposed status change",
        "before": "New",
        "after": "Confirmed",
        "label": "NOVA-037",
        "foot": ""
      },
      "steps": [
        "I approve the change.",
        "NOVA-037 is now marked as confirmed."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-31",
      "category": "orders",
      "title": "Internal order note",
      "question": "Add a note to NOVA-037: the customer asks for a call before dispatch.",
      "answer": "Added an internal note to NOVA-037: “The customer asks for a call before dispatch.”",
      "type": "write",
      "note": "This supported write needs a clear instruction and permissions, but no separate approval. It does not send a customer message.",
      "view": {
        "kind": "facts",
        "title": "Internal note recorded",
        "items": [
          {
            "label": "Order",
            "value": "NOVA-037"
          },
          {
            "label": "Note",
            "value": "Call the customer before dispatch"
          },
          {
            "label": "Customer message sent",
            "value": "No"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-32",
      "category": "orders",
      "title": "Report a packing shortage",
      "question": "While packing NOVA-037, I am missing 2 USB-C-100 units. Record it.",
      "answer": "Recorded a reported shortage of 2 USB-C-100 units for NOVA-037. Stock and the order status are unchanged.",
      "type": "write",
      "note": "The person reports a physical observation. This is not an automatic stock correction.",
      "view": {
        "kind": "facts",
        "title": "Packing observation",
        "items": [
          {
            "label": "Product",
            "value": "USB-C-100"
          },
          {
            "label": "Reported shortage",
            "value": "2 units"
          },
          {
            "label": "Stock and order status",
            "value": "Unchanged"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-33",
      "category": "orders",
      "title": "Book a supported shipment",
      "question": "Book the NOVA-037 parcel with InPost using the saved parameters.",
      "answer": "Booking with InPost is awaiting approval: Orbit Electronics, 1 parcel, 40 × 30 × 20 cm, 2 kg. Do you confirm?",
      "type": "approval",
      "note": "Requires configured InPost, permissions, current packing documents, recipient details and dimensions supplied by a person. No duplicate booking after an uncertain attempt.",
      "view": {
        "kind": "facts",
        "title": "Proposed parcel booking",
        "items": [
          {
            "label": "Carrier",
            "value": "InPost"
          },
          {
            "label": "Recipient",
            "value": "Orbit Electronics"
          },
          {
            "label": "Parcel",
            "value": "40 × 30 × 20 cm"
          },
          {
            "label": "Weight",
            "value": "2 kg"
          }
        ],
        "foot": ""
      },
      "steps": [
        "Yes, I approve this parcel booking.",
        "InPost has confirmed shipment creation. The next step is retrieving the label; collection is not confirmed."
      ],
      "related": [
        "NOVA-34"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-34",
      "category": "orders",
      "title": "Request courier collection",
      "question": "Request courier collection for that booked parcel.",
      "answer": "The InPost collection request for the existing NOVA-037 shipment is awaiting approval.",
      "type": "approval",
      "note": "Requires an existing shipment and configured pickup service. A confirmed request does not promise a collection time or prove physical collection.",
      "view": {
        "kind": "facts",
        "title": "Proposed collection request",
        "items": [
          {
            "label": "Shipment",
            "value": "NOVA-037"
          },
          {
            "label": "Service",
            "value": "Configured InPost pickup"
          },
          {
            "label": "Physical collection",
            "value": "Not confirmed"
          }
        ],
        "foot": ""
      },
      "steps": [
        "I approve the collection request.",
        "The collection request is confirmed. Physical collection of the parcel is not yet confirmed."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-35",
      "category": "sales",
      "title": "Sales from issued invoices",
      "question": "Summarise sales from 1 to 12 October.",
      "answer": "24 completed invoices were issued, totalling USD 148,600 net. Unpaid invoices are included.",
      "type": "analysis",
      "note": "Based on invoice issue date. Sales are not cash received. This example reports USD invoices only.",
      "view": {
        "kind": "metrics",
        "title": "1–12 Oct 2026 · invoiced sales",
        "items": [
          {
            "label": "Completed invoices",
            "value": "24",
            "detail": ""
          },
          {
            "label": "USD · net",
            "value": "148,600",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-36",
        "NOVA-37"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-36",
      "category": "sales",
      "title": "Compare matching periods",
      "question": "Compare USD sales for 1–12 October with 1–12 September.",
      "answer": "October: USD 148,600 net. September: USD 135,000 net. An increase of USD 13,600, or approximately 10.1%.",
      "type": "analysis",
      "note": "Compares two explicit date ranges in the same currency. This is a historical comparison, not a forecast.",
      "view": {
        "kind": "comparison",
        "title": "Like-for-like periods",
        "items": [
          {
            "label": "1–12 Sep",
            "value": 135000
          },
          {
            "label": "1–12 Oct",
            "value": 148600
          }
        ],
        "unit": "USD net",
        "delta": "+10.1%",
        "foot": "Increase: USD 13,600 net."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-37",
      "category": "sales",
      "title": "Units sold",
      "question": "How many units did we sell from 1 to 12 October?",
      "answer": "860 units, based on the items in completed invoices issued during that period.",
      "type": "analysis",
      "note": "Invoiced units are different from all ordered units or the number of shipped parcels.",
      "view": {
        "kind": "metrics",
        "title": "Invoiced quantity",
        "items": [
          {
            "label": "Units sold",
            "value": "860",
            "detail": ""
          }
        ],
        "foot": "Basis: completed invoices · issue date 1–12 Oct 2026."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-38",
      "category": "sales",
      "title": "Customers by sales value",
      "question": "Who bought the most by USD value during that period?",
      "answer": "By net invoice value: Orbit Electronics — USD 32,000; NextWave — USD 26,400; Baltic Volt — USD 22,800.",
      "type": "analysis",
      "note": "Top three in USD. If the source ranking is incomplete, the agent must state that limit.",
      "view": {
        "kind": "ranking",
        "title": "Customers by net invoice value",
        "items": [
          {
            "label": "Orbit Electronics",
            "value": 32000
          },
          {
            "label": "NextWave",
            "value": 26400
          },
          {
            "label": "Baltic Volt",
            "value": 22800
          }
        ],
        "unit": "USD",
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-39"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-39",
      "category": "sales",
      "title": "Customers by units",
      "question": "And which customers bought the most units?",
      "answer": "Orbit Electronics: 190 units; NextWave: 160; Baltic Volt: 140, from invoices in the same period.",
      "type": "analysis",
      "note": "A continuation of the 1–12 October comparison. Uses the quantity ranking, not a re-sort of a partial revenue ranking.",
      "view": {
        "kind": "ranking",
        "title": "Customers by invoiced units",
        "items": [
          {
            "label": "Orbit Electronics",
            "value": 190
          },
          {
            "label": "NextWave",
            "value": 160
          },
          {
            "label": "Baltic Volt",
            "value": 140
          }
        ],
        "unit": "units",
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-40",
      "category": "sales",
      "title": "Average order value",
      "question": "What was the average USD order value from 1 to 12 October?",
      "answer": "USD 1,230 gross across 30 USD orders. This is based on order creation date, not invoice issue date.",
      "type": "analysis",
      "note": "Uses the existing average-order calculation. Each currency is reported separately.",
      "view": {
        "kind": "metrics",
        "title": "Orders placed · 1–12 Oct",
        "items": [
          {
            "label": "Average order",
            "value": "1,230",
            "detail": "USD · gross"
          },
          {
            "label": "USD orders",
            "value": "30",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-41",
      "category": "sales",
      "title": "Order volume and status",
      "question": "Summarise order counts, units and statuses for 1–12 October.",
      "answer": "37 orders and 920 units: 20 new orders, 10 confirmed and 7 packed.",
      "type": "analysis",
      "note": "Based on order creation date. The 920 ordered units are not the same measure as 860 invoiced units.",
      "view": {
        "kind": "ranking",
        "title": "Orders by recorded status",
        "items": [
          {
            "label": "New",
            "value": 20
          },
          {
            "label": "Confirmed",
            "value": 10
          },
          {
            "label": "Packed",
            "value": 7
          }
        ],
        "unit": "orders",
        "foot": "37 orders · 920 units."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-42",
      "category": "sales",
      "title": "Unsuccessful searches",
      "question": "What did customers search for without results in the last 30 days?",
      "answer": "The leading phrases were “4K camera”: 17 searches and “140 W GaN charger”: 11. These are unsuccessful searches, not sales or confirmed orders.",
      "type": "analysis",
      "note": "Requires configured search analytics. Counts represent grouped search intents; a phrase is not automatically a recognised product model.",
      "view": {
        "kind": "ranking",
        "title": "Searches without a result",
        "items": [
          {
            "label": "4K camera",
            "value": 17
          },
          {
            "label": "140 W GaN charger",
            "value": 11
          }
        ],
        "unit": "search intents",
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-43",
      "category": "inbound",
      "title": "Active inbound deliveries",
      "question": "How many active import deliveries do we have?",
      "answer": "12: 3 planned, 4 ordered, 4 shipped and 1 marked as a problem.",
      "type": "read",
      "note": "An active purchase order can still be planned; it is not necessarily in transit.",
      "view": {
        "kind": "ranking",
        "title": "Active purchase orders",
        "items": [
          {
            "label": "Planned",
            "value": 3
          },
          {
            "label": "Ordered",
            "value": 4
          },
          {
            "label": "Shipped",
            "value": 4
          },
          {
            "label": "Problem",
            "value": 1
          }
        ],
        "unit": "P/Os",
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-44",
      "category": "inbound",
      "title": "Deliveries by supplier",
      "question": "Show shipped deliveries from Aurora Components.",
      "answer": "NOVA-PO-001, NOVA-PO-002 and NOVA-PO-003 are marked as shipped, with 180 units in total.",
      "type": "read",
      "note": "Filters by supplier and purchase-order status. Totals must come from a complete result.",
      "view": {
        "kind": "table",
        "title": "Aurora Components",
        "columns": [
          "Purchase order",
          "Status"
        ],
        "rows": [
          [
            "NOVA-PO-001",
            "Shipped"
          ],
          [
            "NOVA-PO-002",
            "Shipped"
          ],
          [
            "NOVA-PO-003",
            "Shipped"
          ]
        ],
        "foot": "180 units across the complete matching result."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-45",
      "category": "inbound",
      "title": "Inbound contents",
      "question": "What is arriving in NOVA-PO-001?",
      "answer": "NOVA-PO-001 contains 60 PB-20000 powerbanks, from Aurora Components.",
      "type": "read",
      "note": "Reads recorded purchase-order lines.",
      "view": {
        "kind": "table",
        "title": "NOVA-PO-001 · Aurora Components",
        "columns": [
          "SKU",
          "Incoming units"
        ],
        "rows": [
          [
            "PB-20000",
            "60"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-46",
        "NOVA-48"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-46",
      "category": "inbound",
      "title": "Recorded transport stage",
      "question": "What stage has NOVA-PO-001 reached?",
      "answer": "Purchase-order status: shipped. Recorded tracking stage: in transit. This is the latest record available in IKUGO.",
      "type": "read",
      "note": "Order status and tracking stage are separate. Reading the record does not itself refresh carrier data.",
      "view": {
        "kind": "facts",
        "title": "NOVA-PO-001",
        "items": [
          {
            "label": "Purchase-order status",
            "value": "Shipped"
          },
          {
            "label": "Recorded tracking stage",
            "value": "In transit"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-47",
      "category": "inbound",
      "title": "Identify a covering delivery",
      "question": "Which delivery can cover the PB-20000 shortage?",
      "answer": "NOVA-PO-001 carries 60 PB-20000 units. With a global shortage of 38, that confirmed delivery is sufficient to cover it.",
      "type": "analysis",
      "note": "Requires operational summaries. This case has one confirmed delivery for the SKU. It is an analysis of coverage, not a stock allocation.",
      "view": {
        "kind": "metrics",
        "title": "NOVA-PO-001 → PB-20000",
        "items": [
          {
            "label": "Global shortage",
            "value": "38",
            "detail": ""
          },
          {
            "label": "Incoming",
            "value": "60",
            "detail": ""
          },
          {
            "label": "Covered",
            "value": "38",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-48",
        "NOVA-09"
      ],
      "keywords": "powerbank battery"
    },
    {
      "id": "NOVA-48",
      "category": "inbound",
      "title": "Follow the delivery context",
      "question": "When is it expected to arrive?",
      "answer": "NOVA-PO-001 has a recorded estimated arrival of 16 October 2026. That is the tracking ETA, not a guaranteed date.",
      "type": "read",
      "note": "Continues the preceding NOVA-PO-001 example. If no ETA is recorded, the agent must say that the date is unavailable.",
      "view": {
        "kind": "facts",
        "title": "Continuing: NOVA-PO-001",
        "items": [
          {
            "label": "Recorded ETA",
            "value": "16 Oct 2026"
          },
          {
            "label": "Source",
            "value": "Recorded tracking estimate"
          },
          {
            "label": "Guaranteed arrival",
            "value": "No"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-47"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-49",
      "category": "inbound",
      "title": "Deliveries needing attention",
      "question": "Which inbound deliveries need attention?",
      "answer": "6 deliveries: PO-002 and PO-009 lack tracking; PO-003 has a long transit alert; PO-004 has a tracking problem; PO-005 lacks cost data; PO-006 has stale tracking.",
      "type": "analysis",
      "note": "Requires operational summaries. These are existing alert rules; no automatic supplier contact or delivery correction is performed.",
      "view": {
        "kind": "table",
        "title": "NOVA inbound alerts",
        "columns": [
          "Delivery",
          "Attention required"
        ],
        "rows": [
          [
            "NOVA-PO-002",
            "Missing tracking"
          ],
          [
            "NOVA-PO-003",
            "Long transit alert"
          ],
          [
            "NOVA-PO-004",
            "Tracking problem"
          ],
          [
            "NOVA-PO-005",
            "Missing cost"
          ],
          [
            "NOVA-PO-006",
            "Stale tracking"
          ],
          [
            "NOVA-PO-009",
            "Missing tracking"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-50",
      "category": "inbound",
      "title": "Planned versus confirmed",
      "question": "Can all 420 units in active purchase orders be treated as incoming stock?",
      "answer": "No. 100 units are only planned. Excluding them leaves 320 units in confirmed active purchase orders.",
      "type": "analysis",
      "note": "Confirmed purchase orders are not all necessarily shipped. Planned quantities do not cover order demand.",
      "view": {
        "kind": "metrics",
        "title": "Active P/O quantities",
        "items": [
          {
            "label": "All active",
            "value": "420",
            "detail": ""
          },
          {
            "label": "Planned",
            "value": "100",
            "detail": ""
          },
          {
            "label": "Excluding planned",
            "value": "320",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-51",
      "category": "finance",
      "title": "Overdue invoices",
      "question": "Which invoices are overdue?",
      "answer": "3 invoices are overdue, totalling USD 7,380. NOVA/FV/032 for USD 4,920 was due on 8 October.",
      "type": "read",
      "note": "Measured as of 12 October 2026 using the existing overdue rule. This example reports USD invoices only.",
      "view": {
        "kind": "metrics",
        "title": "Overdue receivables",
        "items": [
          {
            "label": "Invoices",
            "value": "3",
            "detail": ""
          },
          {
            "label": "USD",
            "value": "7,380",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-53",
        "NOVA-56"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-52",
      "category": "finance",
      "title": "Unpaid is not always overdue",
      "question": "Is every unpaid invoice already overdue?",
      "answer": "No. Of 8 unpaid invoices, 3 are overdue and 5 are due today or later.",
      "type": "analysis",
      "note": "Only completed invoices are counted. This contract records paid/unpaid status, not a partial-payment ledger.",
      "view": {
        "kind": "metrics",
        "title": "Payment status",
        "items": [
          {
            "label": "Unpaid",
            "value": "8",
            "detail": ""
          },
          {
            "label": "Overdue",
            "value": "3",
            "detail": ""
          },
          {
            "label": "Not yet overdue",
            "value": "5",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-53",
      "category": "finance",
      "title": "Invoice details",
      "question": "Check invoice NOVA/FV/032.",
      "answer": "Orbit Electronics: USD 4,000 net, USD 4,920 gross. Due 8 October 2026; the invoice is complete and unpaid.",
      "type": "read",
      "note": "A completed document and its payment status are separate facts.",
      "view": {
        "kind": "invoice",
        "title": "NOVA/FV/032",
        "customer": "Orbit Electronics",
        "status": "Unpaid",
        "net": "USD 4,000",
        "gross": "USD 4,920",
        "due": "8 Oct 2026",
        "foot": "Publication: complete."
      },
      "steps": [],
      "related": [
        "NOVA-55",
        "NOVA-57"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-54",
      "category": "finance",
      "title": "Upcoming due dates",
      "question": "Which unpaid invoices are due from 12 to 18 October?",
      "answer": "NOVA/FV/036: USD 9,840, due 14 October. NOVA/FV/037: USD 3,690, due 16 October.",
      "type": "read",
      "note": "These are recorded due dates for receivables, not confirmed future bank transfers.",
      "view": {
        "kind": "table",
        "title": "Upcoming due dates",
        "columns": [
          "Invoice",
          "Gross amount",
          "Due"
        ],
        "rows": [
          [
            "NOVA/FV/036",
            "USD 9,840",
            "14 Oct"
          ],
          [
            "NOVA/FV/037",
            "USD 3,690",
            "16 Oct"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-55",
      "category": "finance",
      "title": "Reminder history",
      "question": "Have we sent a reminder for NOVA/FV/032?",
      "answer": "Yes. The 10 October attempt was accepted by the mail service. That does not confirm that the customer read it.",
      "type": "read",
      "note": "Uses recorded reminder attempts, not an assumption based on payment status. This case shows an earlier confirmed send.",
      "view": {
        "kind": "facts",
        "title": "Reminder record",
        "items": [
          {
            "label": "Invoice",
            "value": "NOVA/FV/032"
          },
          {
            "label": "Attempt date",
            "value": "10 Oct 2026"
          },
          {
            "label": "Provider acceptance",
            "value": "Confirmed"
          },
          {
            "label": "Customer read receipt",
            "value": "Not confirmed"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-56",
      "category": "finance",
      "title": "Send a payment reminder",
      "question": "Send a payment reminder for NOVA/FV/032.",
      "answer": "A reminder for USD 4,920 to Orbit Electronics is awaiting approval. Send it to billing@orbit.example?",
      "type": "approval",
      "note": "Requires configured email and an authorised decision, with no unresolved earlier send attempt. This example sends no email.",
      "view": {
        "kind": "facts",
        "title": "Proposed reminder",
        "items": [
          {
            "label": "Invoice",
            "value": "NOVA/FV/032"
          },
          {
            "label": "Amount",
            "value": "USD 4,920"
          },
          {
            "label": "Recipient",
            "value": "billing@orbit.example"
          }
        ],
        "foot": ""
      },
      "steps": [
        "Yes, send the reminder.",
        "The mail service accepted the reminder. The invoice remains unpaid."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-57",
      "category": "finance",
      "title": "Mark an invoice as paid",
      "question": "Mark NOVA/FV/032 as paid.",
      "answer": "Marking invoice NOVA/FV/032 for USD 4,920 as paid is awaiting approval.",
      "type": "approval",
      "note": "Requires a completed invoice and a current version check. This records payment status; it neither checks a bank nor transfers money. Synchronisation can remain pending.",
      "view": {
        "kind": "change",
        "title": "Proposed payment status",
        "before": "Unpaid",
        "after": "Paid",
        "label": "NOVA/FV/032 · USD 4,920",
        "foot": ""
      },
      "steps": [
        "I approve — payment has been received.",
        "The invoice is marked as paid locally. Synchronisation of this status is in progress."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-58",
      "category": "finance",
      "title": "Issue from a packing list",
      "question": "Issue an invoice for the prepared NOVA-037 packing list.",
      "answer": "Invoice creation from the current NOVA-037 packing list is awaiting approval. It covers 30 units.",
      "type": "approval",
      "note": "Requires current packing data, complete invoice details and no blocking document. Success needs a completed document and verified PDF; a partial result is not retried as a duplicate. No KSeF action is implied.",
      "view": {
        "kind": "facts",
        "title": "Proposed invoice",
        "items": [
          {
            "label": "Source order",
            "value": "NOVA-037"
          },
          {
            "label": "Basis",
            "value": "Current packing list"
          },
          {
            "label": "Quantity",
            "value": "30 units"
          },
          {
            "label": "Number",
            "value": "Assigned by the application"
          }
        ],
        "foot": ""
      },
      "steps": [
        "I approve issuing the invoice.",
        "Invoice NOVA/FV/038 is ready. Its PDF document is available."
      ],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-59",
      "category": "finance",
      "title": "Documents ready to print",
      "question": "Prepare the NOVA-037 parcel documents for printing.",
      "answer": "The current packing list, invoice and label are ready to open and print in the browser.",
      "type": "read",
      "note": "All documents must already be current, durably stored and accessible with the user’s permissions. This does not confirm a physical printout. The example opens no internal documents.",
      "view": {
        "kind": "documents",
        "title": "Current parcel documents",
        "items": [
          "Packing list",
          "Invoice",
          "Carrier label"
        ],
        "foot": "Ready to open in the application · no physical print confirmed."
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-60",
      "category": "finance",
      "title": "The Cash Flow calculation",
      "question": "How much does our Cash Flow calculation leave for import purchases?",
      "answer": "The calculation shows USD 50,000 after VAT, social insurance, the buffer and the planned purchasing budget. This uses saved settings, not a bank feed.",
      "type": "analysis",
      "note": "A calculation from configured values, not a daily balance forecast or a purchasing decision.",
      "view": {
        "kind": "table",
        "title": "Saved inputs → calculated amount",
        "columns": [
          "Component",
          "USD"
        ],
        "rows": [
          [
            "Recorded balance",
            "100,000"
          ],
          [
            "VAT",
            "−20,000"
          ],
          [
            "Social insurance",
            "−2,000"
          ],
          [
            "Cash buffer",
            "−10,000"
          ],
          [
            "Planned purchases",
            "−18,000"
          ],
          [
            "Remaining",
            "50,000"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-61",
      "category": "customers",
      "title": "Find a business",
      "question": "Find the customer with email billing@orbit.example.",
      "answer": "I found Orbit Electronics. I can check its orders or invoices.",
      "type": "read",
      "note": "Email is a supported search field. Finding a customer does not necessarily expose every contact detail.",
      "view": {
        "kind": "facts",
        "title": "Customer match",
        "items": [
          {
            "label": "Search field",
            "value": "Email"
          },
          {
            "label": "Matched business",
            "value": "Orbit Electronics"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [
        "NOVA-63",
        "NOVA-64"
      ],
      "keywords": ""
    },
    {
      "id": "NOVA-62",
      "category": "customers",
      "title": "Clarify a customer name",
      "question": "Show me the details for Orbit.",
      "answer": "I found Orbit Electronics and Orbit Services. Which company do you mean?",
      "type": "read",
      "note": "The person chooses the business before further reading or writing. The agent does not guess.",
      "view": {
        "kind": "table",
        "title": "Matching businesses",
        "columns": [
          "Customer",
          "Next step"
        ],
        "rows": [
          [
            "Orbit Electronics",
            "Clarify selection"
          ],
          [
            "Orbit Services",
            "Clarify selection"
          ]
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-63",
      "category": "customers",
      "title": "Customer settings",
      "question": "Which language and price list does Orbit Electronics use?",
      "answer": "Service language: English. Assigned price list: 2.",
      "type": "read",
      "note": "Reads the saved language and price-list assignment. It does not change prices or grant a discount.",
      "view": {
        "kind": "facts",
        "title": "Orbit Electronics",
        "items": [
          {
            "label": "Service language",
            "value": "English"
          },
          {
            "label": "Assigned price list",
            "value": "2"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-64",
      "category": "customers",
      "title": "Customer invoice history",
      "question": "Summarise Orbit Electronics invoices.",
      "answer": "3 USD invoices total USD 39,360 gross. USD 24,600 is marked as paid; USD 14,760 remains not marked as paid.",
      "type": "analysis",
      "note": "An unpaid amount is not automatically overdue. The contract does not calculate partial payments.",
      "view": {
        "kind": "metrics",
        "title": "Orbit Electronics · USD gross",
        "items": [
          {
            "label": "Invoice total",
            "value": "39,360",
            "detail": ""
          },
          {
            "label": "Marked paid",
            "value": "24,600",
            "detail": ""
          },
          {
            "label": "Not marked paid",
            "value": "14,760",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-65",
      "category": "customers",
      "title": "Customer order volume",
      "question": "How much did Orbit Electronics order in the last 30 days?",
      "answer": "4 orders, 90 units and USD 9,600 net. This is order value for the period, not the invoice total.",
      "type": "analysis",
      "note": "The customer is resolved first. The period uses order dates and currencies are reported separately.",
      "view": {
        "kind": "metrics",
        "title": "Orbit Electronics · last 30 days",
        "items": [
          {
            "label": "Orders",
            "value": "4",
            "detail": ""
          },
          {
            "label": "Units",
            "value": "90",
            "detail": ""
          },
          {
            "label": "USD · net",
            "value": "9,600",
            "detail": ""
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    },
    {
      "id": "NOVA-66",
      "category": "customers",
      "title": "Remember business terminology",
      "question": "Remember: when I say “OE”, I mean Orbit Electronics.",
      "answer": "Recorded the business abbreviation “OE” as Orbit Electronics.",
      "type": "write",
      "note": "Requires an explicit explanation from the user and a confirmed save. An alias gives no permissions and does not replace a fresh customer lookup.",
      "view": {
        "kind": "facts",
        "title": "Terminology recorded",
        "items": [
          {
            "label": "Term",
            "value": "OE"
          },
          {
            "label": "Meaning",
            "value": "Orbit Electronics"
          },
          {
            "label": "Source",
            "value": "Explicit user explanation"
          }
        ],
        "foot": ""
      },
      "steps": [],
      "related": [],
      "keywords": ""
    }
  ],
  "currency": "USD"
};
