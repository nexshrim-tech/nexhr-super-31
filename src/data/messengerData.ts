
// Sample data for the messenger component

export const sampleChats = [
  {
    id: 1,
    with: {
      id: 1,
      name: "John Doe",
      avatar: "JD",
      status: "online"
    },
    messages: [
      {
        id: 1,
        sender: "user",
        text: "Hello there!",
        time: "10:30 AM"
      },
      {
        id: 2,
        sender: "other",
        text: "Hi! How are you?",
        time: "10:32 AM"
      }
    ]
  }
];

export const employees = [
  {
    id: 1,
    name: "John Doe",
    avatar: "JD",
    status: "online"
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "JS",
    status: "away"
  },
  {
    id: 3,
    name: "Alex Johnson",
    avatar: "AJ",
    status: "offline"
  },
  {
    id: 4,
    name: "Sarah Williams",
    avatar: "SW",
    status: "online"
  },
  {
    id: 5,
    name: "Michael Brown",
    avatar: "MB",
    status: "offline"
  }
];

export const groups = [
  {
    id: 1,
    name: "Marketing Team",
    members: ["John Doe", "Jane Smith", "Alex Johnson"]
  },
  {
    id: 2,
    name: "Development Team",
    members: ["Sarah Williams", "Michael Brown", "John Doe"]
  },
  {
    id: 3,
    name: "HR Department",
    members: ["Jane Smith", "Michael Brown"]
  }
];
