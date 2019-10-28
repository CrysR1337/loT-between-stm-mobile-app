#include "led.h"
#include "delay.h"
#include "sys.h"
#include "usart.h"
#include "lcd.h"
#include "dht11.h"
#include "HX711.h"
#include <time.h>
#include <stdlib.h>
#include <stdio.h>


//ALIENTEK Mini STM32�����巶������11
//TFTLCD��ʾʵ��   
//����֧�֣�www.openedv.com
//������������ӿƼ����޹�˾ 
 int main(void)
 { 
	u8 t=0;			    
	u8 temperature;  	    
	u8 humidity;
	 
	 u8 len;	
	u16 times=0;
	 
	//u8 lcd_id[12];			//���LCD ID�ַ���	
	delay_init();	    	 //��ʱ������ʼ��	  
	uart_init(115200);	 	//���ڳ�ʼ��Ϊ115200
	LED_Init();		  		//��ʼ����LED���ӵ�Ӳ���ӿ�
 	LCD_Init();
	 
	Init_HX711pin();
	 
	POINT_COLOR=GREEN; 
	
	while(DHT11_Init()){
		POINT_COLOR=RED;
		LCD_ShowString(30,130,200,16,16,"DHT11 Error");
		delay_ms(500);
		LCD_Fill(30,130,239,130+16,WHITE);
 		delay_ms(500);
	}
		Get_Maopi();
	 delay_ms(1000);
	 delay_ms(1000);
	 Get_Maopi();
	POINT_COLOR=GREEN;
	LCD_ShowString(30,70,200,16,16,"DHT11 OK");
	POINT_COLOR=BLUE;//��������Ϊ��ɫ 
 	LCD_ShowString(30,100,200,16,16,"Temperature:   C");	 
 	LCD_ShowString(30,130,200,16,16,"Humidity   :   %");	
		POINT_COLOR=BLACK;
	LCD_ShowString(50,200,200,16,16,"Welcome to use the");
	LCD_ShowString(50,220,200,16,16,"Shared Umbrella!!");
	while(1)
	{	    

			if(USART_RX_STA)
		{					   
			len=USART_RX_STA&0x3fff;//�õ��˴ν��յ������ݳ���
			printf("Umbrella message recieve");
//			for(t=0;t<len;t++)
//			{
//				USART1->DR=USART_RX_BUF[t];
//				while((USART1->SR&0X40)==0);//�ȴ����ͽ���
//			}
			//printf("\r\n");//���뻻��
			//printf("%c\r\n\r\n",USART_RX_BUF[0]);
			printf("\r\nThe password is: ");
			printf("%d\r\n",rand()%10000+1);
			printf("Success!\r\n");
			USART_RX_STA=0;
		}else
		{
			times++;
			if(times%1000==0)
			{
				//printf("5seconds test%d\r\n",times);
				//printf("test\r\n\r\n\r\n");
				//printf("%c\r\n\r\n",USART_RX_BUF[0]);
			}
			//if(times%200==0)printf("0.2seconds test\r\n");  
			if(times%30==0)LED1=!LED1;//��˸LED,��ʾϵͳ��������.
			delay_ms(10);   
		}
		
		
		
 		if(t%10==0)			//ÿ100ms��ȡһ��
		{	
			Get_Weight();
			DHT11_Read_Data(&temperature,&humidity);	//��ȡ��ʪ��ֵ	
			LCD_ShowNum(30+100,100,temperature,2,16);	//��ʾ�¶�	   		   
			LCD_ShowNum(30+100,130,humidity,2,16);		//��ʾʪ��	 	 
			POINT_COLOR=RED;
			if(humidity>=80)	
			{
				LCD_ShowString(30,160,200,16,16,"High probability of rain!");
			}
			else
				LCD_ShowString(30,160,200,16,16,"                         ");
			POINT_COLOR=BLUE;
			LCD_ShowString(30,20,200,16,16,"The Weight is:  g");
			POINT_COLOR=RED;
			LCD_ShowNum(30+110,20,Weight_Shiwu,2,16);
			POINT_COLOR=BLUE;
			LCD_ShowString(30,40,200,16,16,"The umbrella is:");
			if(Weight_Shiwu>=50)
			{
				POINT_COLOR=RED;
				LCD_ShowString(30+135,40,200,16,16,"ON!    ");
				printf("Umbrella has been returned!\r\n");
			}
			else
			{
				POINT_COLOR=RED;
				LCD_ShowString(30+135,40,200,16,16,"NOT ON!");
				
			}
		}				   
	 	delay_ms(10);
		t++;
		if(t==20)
		{
			t=0;
			LED1=!LED1;
		}
		
		
		
	}
}
