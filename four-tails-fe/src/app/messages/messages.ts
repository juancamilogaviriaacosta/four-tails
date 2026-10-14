import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

interface ChatMessage {
  id: number;
  text: string;
  time: string;
  sentByMe: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  role: string;
  status: string;
  lastSeen: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: ChatMessage[];
}

@Component({
  selector: 'app-messages',
  imports: [FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  readonly labels = {
    title: 'Messages',
    subtitle: 'Your conversations about pet care',
    search: 'Search conversations',
    emptySearch: 'No matching conversations found.',
    emptyContacts: 'You don’t have any conversations yet.',
    online: 'Online',
    offline: 'Offline',
    back: 'Back to contacts',
    input: 'Type a message',
    send: 'Send message',
    attachment: 'Attach file',
    today: 'Today',
    you: 'You',
    secure: 'Your conversations are private',
  };

  readonly contacts: ChatContact[] = [
    {
      id: 1,
      name: 'Lucía Martínez',
      initials: 'LM',
      avatarColor: '#d8795b',
      role: 'Pet Sitter',
      status: 'online',
      lastSeen: 'Online',
      lastMessage: 'Of course! See you on Friday 🐾',
      lastMessageTime: '10:42',
      unread: 2,
      messages: [
        { id: 1, text: 'Hi! I saw your profile and would like to know if you’re available to look after Milo this Friday.', time: '10:30', sentByMe: true },
        { id: 2, text: 'Hi! Yes, I’m available. What time would you need me to come by?', time: '10:34', sentByMe: false },
        { id: 3, text: 'It would be from 9:00 AM to 5:00 PM. He loves going for walks in the park.', time: '10:38', sentByMe: true },
        { id: 4, text: 'Of course! See you on Friday 🐾', time: '10:42', sentByMe: false },
      ],
    },
    {
      id: 2,
      name: 'Mateo Rojas',
      initials: 'MR',
      avatarColor: '#438c80',
      role: 'Coco’s Owner',
      status: 'offline',
      lastSeen: 'Last seen today at 9:18 AM',
      lastMessage: 'I’ll share Coco’s walking schedule with you.',
      lastMessageTime: '09:18',
      unread: 0,
      messages: [
        { id: 1, text: 'Hi, could you look after Coco on Saturday morning?', time: '09:02', sentByMe: false },
        { id: 2, text: 'Hi Mateo! Yes, I can. How long does Coco need to be walked?', time: '09:10', sentByMe: true },
        { id: 3, text: 'I’ll share Coco’s walking schedule with you.', time: '09:18', sentByMe: false },
      ],
    },
    {
      id: 3,
      name: 'Valentina Cruz',
      initials: 'VC',
      avatarColor: '#9275a8',
      role: 'Pet Sitter',
      status: 'offline',
      lastSeen: 'Last seen yesterday at 6:26 PM',
      lastMessage: 'Thank you for taking such good care of Nala.',
      lastMessageTime: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, text: 'I’m on my way with Nala. She has her food and favorite toy with her.', time: 'Yesterday, 5:40 PM', sentByMe: true },
        { id: 2, text: 'Perfect! We’re all ready to welcome her.', time: 'Yesterday, 5:48 PM', sentByMe: false },
        { id: 3, text: 'Thank you for taking such good care of Nala.', time: 'Yesterday, 6:26 PM', sentByMe: true },
      ],
    },
    {
      id: 4,
      name: 'Andrés Gómez',
      initials: 'AG',
      avatarColor: '#b27b3f',
      role: 'Bruno’s Owner',
      status: 'online',
      lastSeen: 'Online',
      lastMessage: 'Bruno gets along really well with other dogs.',
      lastMessageTime: 'Yesterday',
      unread: 1,
      messages: [
        { id: 1, text: 'Do you have experience with large dogs?', time: 'Yesterday, 4:12 PM', sentByMe: false },
        { id: 2, text: 'Yes, I’ve looked after several. How does Bruno get along with other dogs?', time: 'Yesterday, 4:20 PM', sentByMe: true },
        { id: 3, text: 'Bruno gets along really well with other dogs.', time: 'Yesterday, 4:31 PM', sentByMe: false },
      ],
    },
    {
      id: 5,
      name: 'Camila Torres',
      initials: 'CT',
      avatarColor: '#bd7189',
      role: 'Pet Sitter',
      status: 'offline',
      lastSeen: 'Last seen on Monday',
      lastMessage: 'I’ll send you the photos from the visit 😊',
      lastMessageTime: 'Mon',
      unread: 0,
      messages: [
        { id: 1, text: 'How was Lola during the visit?', time: 'Mon, 2:05 PM', sentByMe: true },
        { id: 2, text: 'She was happy and ate all her food. I’ll send you the photos from the visit 😊', time: 'Mon, 2:22 PM', sentByMe: false },
      ],
    },
  ];

  selectedContact = this.contacts[0];
  searchTerm = '';
  messageDraft = '';
  mobileView: 'contacts' | 'conversation' = 'contacts';

  get filteredContacts(): ChatContact[] {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    if (!query) return this.contacts;
    return this.contacts.filter((contact) =>
      `${contact.name} ${contact.role} ${contact.lastMessage}`.toLocaleLowerCase().includes(query),
    );
  }

  selectContact(contact: ChatContact): void {
    this.selectedContact = contact;
    contact.unread = 0;
    this.mobileView = 'conversation';
  }

  showContacts(): void {
    this.mobileView = 'contacts';
  }

  sendMessage(): void {
    const text = this.messageDraft.trim();
    if (!text) return;

    const now = new Date();
    const time = now.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    this.selectedContact.messages.push({
      id: Date.now(),
      text,
      time,
      sentByMe: true,
    });
    this.selectedContact.lastMessage = text;
    this.selectedContact.lastMessageTime = time;
    this.messageDraft = '';
  }
}
