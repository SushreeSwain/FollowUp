import cron from 'node-cron';
import User from '../models/User.js';
import Session from '../models/Sessions.js';
import Client from '../models/Client.js';
import { sendEmail } from '../utils/sendEmail.js';

cron.schedule('0 7 * * *', async () => {
  console.log('Running reminder job...');

  const users = await User.find({ remindersEnabled: true });

  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayEnd = new Date();
  todayEnd.setHours(23,59,59,999);

  for (const user of users) {
    const sessions = await Session.find({
      userId: user._id,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    if (sessions.length === 0) continue;

    let message = 'Today’s Sessions:\n\n';

    for (const session of sessions) {
      const client = await Client.findById(session.clientId);

      message += `• ${client?.name || 'Client'} at ${new Date(session.date).toLocaleTimeString()}\n`;
    }

    await sendEmail(
      user.email,
      'Your FollowUp Sessions Today',
      message
    );
  }
});