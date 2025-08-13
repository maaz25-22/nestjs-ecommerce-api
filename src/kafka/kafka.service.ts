import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('kafka.clientId'),
      brokers: this.configService.get<string[]>('kafka.brokers'),
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'ecommerce-group' });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      console.log('✅ Kafka connected successfully');
    } catch (error) {
      console.log('⚠️ Kafka connection failed, continuing without Kafka...');
    }
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async sendMessage(topic: string, message: any) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });
    } catch (error) {
      console.log('⚠️ Kafka message send failed:', error.message);
    }
  }

  async subscribe(topic: string, callback: (message: any) => void) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: true });
      
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = JSON.parse(message.value.toString());
          callback(value);
        },
      });
    } catch (error) {
      console.log('⚠️ Kafka subscription failed:', error.message);
    }
  }
}
