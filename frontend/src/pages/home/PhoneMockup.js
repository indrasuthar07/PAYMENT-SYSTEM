import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Plus,
} from "lucide-react";

const PhoneMockup = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[3rem] blur-3xl opacity-30 scale-90" />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] rounded-[3rem] bg-black p-3 shadow-2xl"
      >
        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

          <div className="p-5 pt-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm text-gray-600">PayWallet</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold">IS</span>
              </div>
            </div>

            {/* Balance */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-5 mb-5 text-white"
            >
              <p className="text-xs opacity-80">Total Balance</p>
              <p className="text-3xl font-bold">$12,458.50</p>
              <p className="text-xs opacity-80 mt-1">
                +$1,250.00 this month
              </p>
            </motion.div>

            {/* Actions */}
            <div className="grid grid-cols-4 gap-3 mb-5 text-center text-xs">
              {[
                { icon: Plus, label: "Add" },
                { icon: ArrowUpRight, label: "Send" },
                { icon: QrCode, label: "Scan" },
                { icon: ArrowDownLeft, label: "Request" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <item.icon className="h-4 w-4 text-bold text-gray-700" />
                  </div>
                  <span className="text-[10px] text-gray-600 font-medium">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Transactions */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-semibold mb-3">
                Recent Activity
              </p>

              <div className="space-y-3">
                {[
                  { name: "Indra S.", amount: "-$85.00", type: "out" },
                  { name: "Dad", amount: "+$3,200.00", type: "in" },
                  { name: "Netflix", amount: "-$15.99", type: "out" },
                ].map((tx, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -15, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 + i * 0.15 }}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === "in"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {tx.type === "in" ? (
                          <ArrowDownLeft className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {tx.name}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        tx.type === "in"
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {tx.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -top-4 -right-4 bg-purple-500 p-4 rounded-2xl shadow-lg"
      >
        <QrCode className="h-8 w-8 text-white" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 bg-green-500 p-4 rounded-2xl shadow-lg"
      >
        <ArrowUpRight className="h-8 w-8 text-white" />
      </motion.div>
    </div>
  );
};

export default PhoneMockup;
