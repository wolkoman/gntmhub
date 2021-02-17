import {DatabaseService, UserEntity} from './DatabaseService';

export async function sendBulkMessage(message: string) {
  const usersCollection = await DatabaseService.getCollection(UserEntity);
  const users = await usersCollection.find({}).toArray();
  return await Promise.all(users.filter(user => user.active).map(user =>
    fetch(`	https://smsgateway.me/api/v4/message/send`, {
      method: 'POST',
      headers: {Authorization: process.env.SMS_GATEWAY_TOKEN},
      body: JSON.stringify([
        {
          phone_number: user.phone,
          message,
          device_id: process.env.SMS_GATEWAY_DEVICE,
        },
      ]),
    })
      .then(x => x.json())
      .catch(x => console.log('ERR', x))));
}
