import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Configura come gestire le notifiche quando l'app è in primo piano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const REMINDER_ID = 'daily-exercise-reminder';

const isWeb = Platform.OS === 'web';

export const NotificationService = {
  /**
   * Richiede i permessi per le notifiche se non sono già stati concessi.
   */
  requestPermissions: async (): Promise<boolean> => {
    if (isWeb) {
      // Sul web usiamo l'API nativa del browser per i permessi
      if (!("Notification" in window)) return false;
      const permission = await window.Notification.requestPermission();
      return permission === 'granted';
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  /**
   * Verifica se i permessi sono attualmente concessi.
   */
  checkPermissions: async (): Promise<boolean> => {
    if (isWeb) {
      return "Notification" in window && window.Notification.permission === 'granted';
    }
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Pianifica la notifica giornaliera alle 08:00.
   */
  scheduleDailyReminder: async (hours: number = 8, minutes: number = 0) => {
    if (isWeb) {
      console.log("Pianificazione non supportata nativamente su Web tramite Expo Go. Verrà simulata.");
      return;
    }
    // Prima cancella eventuali notifiche esistenti con lo stesso ID (o tutte)
    await NotificationService.cancelAllReminders();

    // Pianifica la nuova notifica
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Buongiorno! ☀️",
        body: "I tuoi esercizi del giorno sono pronti. Naviga l'app per iniziare al meglio la giornata",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      } as any, // Using any because of potential version mismatch in types but following docs
    });
    
    console.log(`Notifica pianificata per le ${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
  },

  /**
   * Cancella tutte le notifiche pianificate.
   */
  cancelAllReminders: async () => {
    if (isWeb) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  /**
   * (Opzionale) Invia una notifica di test immediata (dopo 2 secondi).
   */
  sendTestNotification: async () => {
    console.log("Tentativo invio notifica di test...");
    
    if (isWeb) {
      // Mock per il web usando l'API nativa del browser se disponibile
      if ("Notification" in window && window.Notification.permission === "granted") {
        setTimeout(() => {
          new window.Notification("Test Notifica 🚀", {
            body: "Se vedi questo, le notifiche web (browser) funzionano!",
          });
          // Fallback visuale nell'app
          Alert.alert("Test Notifica 🚀", "Se vedi questo, le notifiche web sono attive!");
        }, 2000);
        console.log("Notifica test browser programmata (2s)");
      } else {
        alert("Notifiche non supportate o non autorizzate su questo browser.");
      }
      return;
    }

    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notifica 🚀",
          body: "Se vedi questo, le notifiche sono configurate correttamente!",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        } as any,
      });
      console.log("Notifica test programmata con ID:", identifier);
    } catch (error) {
      console.error("Errore durante l'invio della notifica di test:", error);
    }
  }
};
